// index.js
// Entry point bot WhatsApp. Menghubungkan ke WhatsApp via habibih-bailys,
// memuat semua command, dan meneruskan setiap pesan/event masuk ke handler.

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("habibih-bailys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const chalk = require("chalk");
const qrcode = require("qrcode-terminal");
const readline = require("readline");

const config = require("./config");
const { loadCommands } = require("./lib/commandLoader");
const { handleMessage } = require("./lib/handler");
const { onGroupParticipantsUpdate } = require("./lib/groupEvents");
const { handleGameAnswer } = require("./lib/gameListener");

const startTime = Date.now();
const stats = { messageCount: 0 };

function question(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, (answer) => {
    rl.close();
    resolve(answer.trim());
  }));
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const useQR = config.loginMethod === "qr";

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: useQR,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  const commands = loadCommands();
  console.log(chalk.green(`[${config.botName}] ${commands.size} alias/command dimuat.`));

  // ====== PAIRING CODE ======
  if (!useQR && !sock.authState.creds.registered) {
    let number = config.pairingNumber;
    if (!number) {
      number = await question(
        chalk.yellow("Masukkan nomor WhatsApp bot untuk pairing (contoh: 6281234567890): ")
      );
    }
    number = number.replace(/[^0-9]/g, "");

    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(number);
        console.log(chalk.cyan.bold(`\n🔑 Pairing Code: ${code}\n`));
        console.log(
          chalk.gray("Buka WhatsApp > Perangkat Tertaut > Tautkan dengan nomor telepon, masukkan kode di atas.")
        );
      } catch (err) {
        console.error(chalk.red("Gagal membuat pairing code:"), err.message);
      }
    }, 3000);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && useQR) {
      console.log(chalk.yellow("Scan QR berikut untuk login:"));
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(
        chalk.red(`Koneksi terputus (code: ${statusCode}). Reconnect: ${shouldReconnect}`)
      );
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log(chalk.cyan(`✅ ${config.botName} berhasil terhubung ke WhatsApp!`));

      // ====== AUTO-FOLLOW CHANNEL (transparan, hanya jalan kalau diaktifkan sendiri) ======
      if (config.enableAutoFollow && config.autoFollowChannels.length > 0) {
        for (const channelId of config.autoFollowChannels) {
          sock.newsletterFollow?.(channelId).catch((err) => {
            console.error(chalk.red(`Gagal follow channel ${channelId}:`), err.message);
          });
        }
        console.log(chalk.green(`Auto-follow ${config.autoFollowChannels.length} channel dijalankan.`));
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      const answered = await handleGameAnswer(sock, message);
      if (!answered) await handleMessage(sock, message, commands, startTime, stats);
    }
  });

  // Welcome, promote, demote, kick notification di grup
  sock.ev.on("group-participants-update", (event) => onGroupParticipantsUpdate(sock, event));

  return sock;
}

startBot().catch((err) => {
  console.error(chalk.red("Gagal memulai bot:"), err);
  process.exit(1);
});
