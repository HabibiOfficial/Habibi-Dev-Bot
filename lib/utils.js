// lib/utils.js
// Kumpulan fungsi utilitas kecil yang dipakai berulang di banyak command.

/** Ubah durasi milidetik jadi format "0h 0j 0m 0s" */
function formatUptime(ms) {
  let seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${days}h ${hours}j ${minutes}m ${seconds}s`;
}

/** Ubah bytes jadi format "12.3 MB" */
function formatBytes(bytes) {
  if (!bytes) return "0 MB";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

/** Ambil satu elemen random dari array */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random integer inklusif [min, max] */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Bikin persentase acak dengan seed berdasarkan teks (hasil konsisten untuk input yang sama) */
function seededPercent(seedText) {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 101; // 0 - 100
}

/** Format tanggal & waktu ke gaya Indonesia, contoh: "22:35 WIB • Rabu, 01 Juli 2026" */
function formatDateTimeID(date = new Date()) {
  const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const jam = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${jam} WIB • ${hari}, ${tanggal}`;
}

/** Cek apakah ctx punya lampiran gambar/video (quoted atau langsung) */
function getQuotedMessage(message) {
  const ctxInfo = message.message?.extendedTextMessage?.contextInfo;
  return ctxInfo?.quotedMessage || null;
}

/** Sleep helper */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  formatUptime,
  formatBytes,
  pickRandom,
  randomInt,
  seededPercent,
  formatDateTimeID,
  getQuotedMessage,
  sleep,
};
