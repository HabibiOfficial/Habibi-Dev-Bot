// commands/main/kategori.js
// Menampilkan daftar command per kategori. Dipanggil lewat ".menu <kategori>"
// tapi juga tersedia sebagai command mandiri ".listmenu" untuk lihat semua kategori.

const { groupByCategory } = require("../../lib/commandLoader");
const config = require("../../config");

const CATEGORY_LABELS = {
  main: "📋 MAIN",
  download: "📥 DOWNLOAD",
  fun: "🎉 HIBURAN",
  tts: "🎤 TTS",
  game: "🎲 GAME",
  stalker: "🔍 STALKER",
  cek: "💫 CEK",
  audio: "🎵 AUDIO EFFECT",
  canvas: "🖼️ CANVAS",
  ephoto: "✨ EPHOTO",
  sticker: "🎨 STICKER",
  group: "👥 GRUP",
  aiimage: "🤖 AI IMAGE",
  religi: "🕌 RELIGI",
  user: "👤 USER",
  search: "🔎 SEARCH",
};

module.exports = {
  name: "listmenu",
  aliases: ["daftarmenu", "allcommand"],
  category: "main",
  description: "Menampilkan daftar semua kategori command.",
  async execute(ctx) {
    const grouped = groupByCategory(ctx.commands);
    let text = `📚 *DAFTAR KATEGORI MENU*\n${config.watermark}\n\n`;

    for (const [category, cmds] of Object.entries(grouped)) {
      const label = CATEGORY_LABELS[category] || category.toUpperCase();
      text += `「 ${label} 」 ${cmds.length} cmd\n`;
    }

    text += `\nKetik *${ctx.usedPrefix}menu <nama_kategori>* untuk lihat detail command.`;
    await ctx.reply(text);
  },
};

module.exports.CATEGORY_LABELS = CATEGORY_LABELS;
