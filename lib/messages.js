// lib/messages.js
// Kumpulan pesan standar (global.mess style) yang dipakai di seluruh command
// untuk menolak eksekusi ketika syarat tertentu tidak terpenuhi.

module.exports = {
  owner: "❌ Khusus *Owner Bot* yang bisa pakai command ini!",
  prem: "💎 Fitur ini khusus *Member Premium*! Ketik *.ceksewa* untuk info berlangganan.",
  group: "👥 Command ini hanya bisa dipakai di dalam *Grup*!",
  admin: "🛡️ Kamu harus jadi *Admin Grup* untuk pakai command ini!",
  botadmin: "🤖 Bot harus dijadikan *Admin Grup* dulu untuk pakai command ini!",
  private: "📩 Command ini hanya bisa dipakai di *Chat Pribadi*!",
  done: "✅ Berhasil!",
  wait: "⏳ Sedang diproses, mohon tunggu...",
  error: "❌ Terjadi kesalahan, coba lagi nanti.",
  notFound: "❓ Command atau data tidak ditemukan.",
  invalidArgs: "⚠️ Format perintah salah. Ketik *.help <command>* untuk lihat contoh penggunaan.",
  apiNotConfigured: "⚙️ API untuk fitur ini belum diatur oleh owner. Silakan isi *config.js* pada bagian `api`.",
  featureDisabled: "🚫 Fitur ini sedang dinonaktifkan.",
  cooldown: (seconds) => `⏱️ Tunggu ${seconds} detik lagi sebelum memakai command ini.`,
};
