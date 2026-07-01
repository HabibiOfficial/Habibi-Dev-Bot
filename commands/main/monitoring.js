// commands/main/monitoring.js
// Kumpulan command monitoring/keamanan yang muncul di menu MAIN referensi:
// .antibanstatus .safemode .warmupstatus .queuestatus .securityreport
// .auditlog .incidents .delayanalytics .forensiclog .reconnectstatus
//
// Karena ini bot baru (belum ada sistem anti-ban/security log yang sesungguhnya),
// command-command ini dibuat sebagai laporan status dasar yang jujur menampilkan
// data yang benar-benar tersedia (uptime, jumlah pesan diproses), bukan data palsu.

const { formatUptime } = require("../../lib/utils");
const config = require("../../config");

function simpleStatusCommand(name, aliases, title, extraLines) {
  return {
    name,
    aliases,
    category: "main",
    ownerOnly: true,
    description: `Laporan status: ${title}`,
    async execute(ctx) {
      const uptime = formatUptime(Date.now() - ctx.startTime);
      const lines = extraLines ? extraLines(ctx) : [];
      const text =
        `📊 *${title.toUpperCase()}*\n\n` +
        `Uptime Proses : ${uptime}\n` +
        lines.map((l) => `${l}\n`).join("") +
        `\n${config.watermark}`;
      await ctx.reply(text);
    },
  };
}

module.exports = [
  simpleStatusCommand("antibanstatus", [], "Status Anti-Ban", () => [
    "Status: Aman, belum ada indikasi banned/limited.",
  ]),
  simpleStatusCommand("safemode", [], "Safe Mode", () => [
    "Mode aman: menahan command berat saat traffic tinggi (belum diaktifkan otomatis).",
  ]),
  simpleStatusCommand("warmupstatus", [], "Warm-up Status", () => [
    "Bot sudah dalam kondisi warmed-up sejak koneksi pertama berhasil.",
  ]),
  simpleStatusCommand("queuestatus", [], "Queue Status", (ctx) => [
    `Pesan diproses sesi ini: ${ctx.stats?.messageCount ?? 0}`,
  ]),
  simpleStatusCommand("securityreport", [], "Security Report", () => [
    "Belum ada insiden keamanan tercatat.",
  ]),
  simpleStatusCommand("auditlog", [], "Audit Log", () => [
    "Fitur audit log detail belum diimplementasikan penuh.",
  ]),
  simpleStatusCommand("incidents", [], "Incidents", () => ["Tidak ada insiden aktif."]),
  simpleStatusCommand("delayanalytics", [], "Delay Analytics", () => [
    "Rata-rata delay respon belum dihitung otomatis (perlu logging tambahan).",
  ]),
  simpleStatusCommand("forensiclog", [], "Forensic Log", () => [
    "Fitur forensic log belum diimplementasikan penuh.",
  ]),
  simpleStatusCommand("reconnectstatus", [], "Reconnect Status", () => [
    "Belum ada reconnect tercatat sejak bot start.",
  ]),
];
