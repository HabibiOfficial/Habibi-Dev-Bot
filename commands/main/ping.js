// commands/main/ping.js
// Dashboard bot: uptime, ping, RAM, CPU, platform, statistik.

const os = require("os");
const config = require("../../config");
const { formatUptime, formatBytes } = require("../../lib/utils");
const { groupByCategory } = require("../../lib/commandLoader");

module.exports = {
  name: "ping",
  aliases: ["speed", "status", "bothealth"],
  category: "main",
  description: "Menampilkan dashboard status bot.",
  async execute(ctx) {
    const start = Date.now();
    // ping "nyata" diukur dari selisih waktu proses awal eksekusi hingga sebelum reply
    const uptime = formatUptime(Date.now() - ctx.startTime);
    const mem = process.memoryUsage();
    const totalRam = os.totalmem();
    const cpuPercent = Math.round(os.loadavg()[0] * 10) / 10;
    const grouped = groupByCategory(ctx.commands);
    const totalCommands = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

    const pingMs = Date.now() - start;

    const text =
      `!! *BOT DASHBOARD* 🖥️\n` +
      `!! Nama    : ${config.botName}\n` +
      `!! Owner   : ${config.ownerName}\n` +
      `!! Status  : Online\n` +
      `!! Prefix  : [ ${(Array.isArray(config.prefix) ? config.prefix : [config.prefix]).join(" / ")} ]\n\n` +
      `—— SYSTEM ——\n` +
      `!! Uptime  : ${uptime}\n` +
      `!! Ping    : ${pingMs}ms\n` +
      `!! RAM     : ${formatBytes(mem.rss)} / ${formatBytes(totalRam)}\n` +
      `!! CPU     : ${cpuPercent}%\n` +
      `!! Platform: ${config.platform}\n` +
      `!! Node.js : ${process.version}\n\n` +
      `—— STATISTIK ——\n` +
      `!! Command : ${totalCommands}\n` +
      `!! Pesan   : ${ctx.stats?.messageCount ?? 0}\n\n` +
      `_${config.botName}_\n${config.watermark}`;

    await ctx.reply(text);
  },
};
