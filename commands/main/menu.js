// commands/main/menu.js
// Menu utama bot: menampilkan info bot + tombol untuk menjelajahi kategori.

const config = require("../../config");
const { formatUptime, formatBytes, formatDateTimeID } = require("../../lib/utils");
const { groupByCategory } = require("../../lib/commandLoader");

module.exports = {
  name: "menu",
  aliases: ["help", "allmenu"],
  category: "main",
  description: "Menampilkan menu utama bot.",
  async execute(ctx) {
    const uptime = formatUptime(Date.now() - ctx.startTime);
    const ram = formatBytes(process.memoryUsage().rss);
    const totalCommands = groupByCategory(ctx.commands);
    const totalCount = Object.values(totalCommands).reduce((sum, arr) => sum + arr.length, 0);

    const caption =
      `Selamat datang di simple menu *${config.botName}*, ` +
      `aku adalah bot yang dibuat oleh *${config.devName}*\n\n` +
      `${config.greeting}\n` +
      `@${config.storeName}\n\n` +
      `BOT     : _${config.botName}_\n` +
      `OWNER   : ${config.ownerName}\n` +
      `PREFIX  : ${ctx.usedPrefix}\n` +
      `ROLE    : 👤 ${config.defaultRole}\n\n` +
      `UPTIME  : ${uptime}\n` +
      `RAM     : ${ram}\n` +
      `COMMAND : ${totalCount}\n\n` +
      `${formatDateTimeID()}\n\n` +
      `${config.watermark}\n\n` +
      `📋 Ketik *${ctx.usedPrefix}menu <kategori>* untuk lihat command per kategori.\n` +
      `Contoh: *${ctx.usedPrefix}menu grup*`;

    await ctx.reply({
      text: caption,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        externalAdReply: {
          title: config.storeName,
          body: formatDateTimeID(),
          thumbnailUrl: "",
          sourceUrl: config.channelLink,
          renderLargerThumbnail: true,
          showAdAttribution: false,
        },
      },
    });
  },
};
