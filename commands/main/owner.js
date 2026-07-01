// commands/main/owner.js
// Menampilkan kontak owner bot & info sewa bot.

const config = require("../../config");

const ownerCommand = {
  name: "owner",
  aliases: [],
  category: "main",
  description: "Menampilkan kontak owner bot.",
  async execute(ctx) {
    const text =
      `👑 *OWNER BOT*\n\n` +
      `Nama  : ${config.ownerName}\n` +
      `Nomor : wa.me/${config.ownerNumber[0]}\n\n` +
      `Hubungi owner untuk kerjasama, laporan bug, atau sewa bot.\n${config.watermark}`;
    await ctx.reply(text);
  },
};

const cekSewaCommand = {
  name: "ceksewa",
  aliases: ["sewabot", "infosewa"],
  category: "main",
  description: "Menampilkan info sewa bot.",
  async execute(ctx) {
    const text =
      `💎 *INFO SEWA BOT*\n\n` +
      `Harga   : ${config.premiumPrice}\n` +
      `Kontak  : wa.me/${config.sewaContact}\n\n` +
      `Ketik pesan ke kontak di atas untuk info lebih lanjut.\n${config.watermark}`;
    await ctx.reply(text);
  },
};

module.exports = [ownerCommand, cekSewaCommand];
