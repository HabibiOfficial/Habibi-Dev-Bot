// index.js
// Entry point bot WhatsApp. Menghubungkan ke WhatsApp via Baileys (resmi),
// memuat semua command, dan meneruskan setiap pesan/event masuk ke handler.

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const chalk = require("chalk");
const qrcode = require("qrcode-terminal");
const readline = require("readline");
const fs = require("fs-extra");

const config = require("./config");
const { loadCommands } = require("./lib/commandLoader");
const { handleMessage } = require("./lib/handler");
const { onGroupParticipantsUpdate } = require("./lib/groupEvents");
const { handleGameAnswer } = require("./lib/gameListener");

const startTime = Date.now();
const stats = { messageCount: 0 };

// Muat command sekali saja di awal (tidak perlu di-reload tiap reconnect).
const commands = loadCommands();
console.log(chalk.green(`[${config.botName}] ${commands.size} alias/command dimuat.`));

// ====== Kontrol reconnect supaya tidak infinite-loop saat gagal terus ======
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 5000;
let reconnectAttempts = 0;
let pairingRequested = false; // supaya pairing code hanya diminta sekali per proses

function question(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

/** Hapus folder session (dipakai saat auth benar-benar tidak valid lagi). */
async function clearSession() {
  try {
    await fs.remove(config.sessionFolder);
    console.log(chalk.yellow("Session lama dihapus. Silakan restart bot untuk login ulang."));
  } catch (err) {
    console.error(chalk.red("Gagal menghapus session:"), err.message);
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);

  // fetchLatestBaileysVersion bisa gagal (jaringan/endpoint) -> fallback agar bot tetap jalan.
  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion());
    console.log(chalk.gray(`Menggunakan WA version: ${version.join(".")}`));
  } catch (err) {
    console.warn(chalk.yellow(`Gagal fetch WA version (${err.message}), memakai versi bawaan library.`));
  }

  const useQR = config.loginMethod === "qr";

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // deprecated di Baileys 7.x -> QR dirender manual di connection.update
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  // ====== PAIRING CODE ======
  if (!useQR && !sock.authState.creds.registered && !pairingRequested) {
    pairingRequested = true;

    let number = config.pairingNumber;
    if (!number || number.replace(/[^0-9]/g, "") === "6281234567890") {
      console.log(
        chalk.yellow(
          "\n⚠️  config.pairingNumber masih kosong atau masih nomor contoh (6281234567890)."
        )
      );
      number = await question(
        chalk.yellow("Masukkan nomor WhatsApp bot untuk pairing (contoh: 62812xxxxxxx): ")
      );
    }
    number = number.replace(/[^0-9]/g, "");

    // Beri jeda supaya socket sempat terhubung sebelum minta pairing code.
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(number);
        const pretty = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.cyan.bold(`\n🔑 Pairing Code: ${pretty}\n`));
        console.log(
          chalk.gray(
            "Buka WhatsApp > Perangkat Tertaut > Tautkan dengan nomor telepon, lalu masukkan kode di atas."
          )
        );
      } catch (err) {
        console.error(chalk.red("Gagal membuat pairing code:"), err.message);
      }
    }, 3000);
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && useQR) {
      console.log(chalk.yellow("Scan QR berikut untuk login:"));
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      reconnectAttempts = 0; // reset saat berhasil konek
      console.log(chalk.cyan(`✅ ${config.botName} berhasil terhubung ke WhatsApp!`));

      if (config.enableAutoFollow && config.autoFollowChannels.length > 0) {
        for (const channelId of config.autoFollowChannels) {
          sock.newsletterFollow?.(channelId).catch((err) => {
            console.error(chalk.red(`Gagal follow channel ${channelId}:`), err.message);
          });
        }
        console.log(chalk.green(`Auto-follow ${config.autoFollowChannels.length} channel dijalankan.`));
      }
      return;
    }

    if (connection === "close") {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const reasonName =
        Object.keys(DisconnectReason).find((k) => DisconnectReason[k] === statusCode) || "unknown";

      // Log error asli secara lengkap agar mudah didiagnosa.
      console.log(chalk.red(`Koneksi terputus (code: ${statusCode} / ${reasonName}).`));
      if (lastDisconnect?.error) {
        console.log(chalk.gray(`Detail: ${lastDisconnect.error?.message || lastDisconnect.error}`));
      }

      // Kasus yang TIDAK boleh auto-reconnect: sudah logout, atau auth ditolak permanen.
      if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.red("Bot ter-logout. Menghapus session..."));
        await clearSession();
        process.exit(0);
      }

      // Code 405 / 401 / 403 saat BELUM registered biasanya berarti kredensial/nomor bermasalah.
      const authRejected = [401, 403, 405].includes(statusCode);
      if (authRejected && !sock.authState.creds.registered) {
        console.log(
          chalk.red(
            "\n❌ Koneksi ditolak WhatsApp (kemungkinan nomor pairing salah, atau session korup)."
          )
        );
        console.log(
          chalk.yellow(
            "Langkah perbaikan:\n" +
              "  1. Pastikan config.pairingNumber = nomor WA yang SAMA dengan yang kamu pakai untuk memasukkan kode di HP.\n" +
              "  2. Session lama akan dihapus otomatis sekarang.\n" +
              "  3. Restart bot, lalu masukkan pairing code baru dengan cepat (< 60 detik)."
          )
        );
        await clearSession();
        process.exit(1);
      }

      // Reconnect dengan batas percobaan + backoff.
      reconnectAttempts += 1;
      if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        console.log(
          chalk.red(`Gagal reconnect setelah ${MAX_RECONNECT_ATTEMPTS} percobaan. Berhenti.`)
        );
        process.exit(1);
      }

      const delay = RECONNECT_BASE_DELAY_MS * reconnectAttempts;
      console.log(
        chalk.yellow(`Reconnect percobaan ke-${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dalam ${delay / 1000}s...`)
      );
      setTimeout(startBot, delay);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      try {
        const answered = await handleGameAnswer(sock, message);
        if (!answered) await handleMessage(sock, message, commands, startTime, stats);
      } catch (err) {
        console.error(chalk.red("Error memproses pesan:"), err.message);
      }
    }
  });

  sock.ev.on("group-participants-update", (event) => onGroupParticipantsUpdate(sock, event));

  return sock;
}

startBot().catch((err) => {
  console.error(chalk.red("Gagal memulai bot:"), err);
  process.exit(1);
});
