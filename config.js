// config.js
// Konfigurasi utama bot. Sesuaikan semua nilai di sini sesuai kebutuhanmu.
// Tidak perlu edit file lain untuk mengubah identitas bot, prefix, atau metode login.

module.exports = {
  // ====== IDENTITAS BOT ======
  botName: "Habibih Bot",
  storeName: "Habibih Store",
  botVersion: "1.0.0",
  botCode: "HABIBIH",

  // ====== OWNER / DEVELOPER ======
  ownerName: "Habibih Store",
  ownerNumber: ["6281234567890"], // Ganti dengan nomor WA owner asli (format: 62xxxxxxxxxxx)
  devName: "Habibih Store",
  devNumber: ["6281234567890"],

  // ====== PREFIX ======
  // Bot akan merespon salah satu dari prefix ini
  prefix: [".", "/", "#", "?", "!"],

  // ====== LINK & SOSMED ======
  channelLink: "https://whatsapp.com/channel/xxxxxxxxxxxxxxxxxxxxx",
  groupLink: "",
  githubLink: "https://github.com/HabibiOfficial/Habibi-Dev-Bot",

  // ====== SEWA / PREMIUM ======
  premiumPrice: "Hubungi Owner",
  sewaContact: "6281234567890",

  // ====== HOSTING / PLATFORM ======
  platform: "Pterodactyl", // contoh lain: "VPS", "Termux", "RDP"

  // ====== BRANDING TEKS ======
  watermark: "© Habibih Store",
  greeting: "こんにちは 👋",

  // ====== ROLE DEFAULT ======
  defaultRole: "User Biasa",

  // ====== METODE LOGIN ======
  // Pilihan: "pairing" atau "qr"
  loginMethod: "pairing",
  // Nomor WA bot (wajib diisi kalau loginMethod = "pairing"), format: 62xxxxxxxxxxx
  pairingNumber: "6281234567890",

  // ====== AUTO-FOLLOW CHANNEL (channel milik sendiri) ======
  // Diaktifkan/dinonaktifkan secara eksplisit dan transparan (bukan diam-diam).
  enableAutoFollow: false,
  autoFollowChannels: [
    // Isi dengan ID channel WhatsApp milikmu sendiri, contoh:
    // "120363421412174731@newsletter",
  ],

  // ====== SESSION ======
  sessionFolder: "./session",

  // ====== API PIHAK KETIGA (opsional) ======
  // Beberapa command (downloader/AI image/dll) memerlukan API key.
  // Kosongkan jika belum punya, command terkait akan menampilkan pesan "API belum diatur".
  api: {
    baseUrl: "", // contoh: "https://api.contoh.com"
    key: "", // API key
  },
};
