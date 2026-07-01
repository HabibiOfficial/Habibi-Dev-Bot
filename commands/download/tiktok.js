// commands/download/tiktok.js
// Downloader TikTok real memakai endpoint publik tikwm.com (tanpa perlu API key).

const axios = require("axios");
const mess = require("../../lib/messages");

async function fetchTikTok(url) {
  const { data } = await axios.get("https://www.tikwm.com/api/", {
    params: { url },
    timeout: 20000,
  });
  if (data?.code !== 0) throw new Error(data?.msg || "Gagal mengambil data TikTok.");
  return data.data;
}

const ttCommand = {
  name: "tt",
  aliases: ["tiktok"],
  category: "download",
  description: "Download video TikTok tanpa watermark.",
  async execute(ctx) {
    if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}tt https://vt.tiktok.com/xxxxx`);
    await ctx.reply(mess.wait);
    try {
      const result = await fetchTikTok(ctx.text);
      await ctx.sock.sendMessage(
        ctx.from,
        {
          video: { url: result.play },
          caption: `🎬 *${result.title || "TikTok Video"}*\n👤 ${result.author?.nickname || "-"}\n👍 ${result.digg_count} • 💬 ${result.comment_count}`,
        },
        { quoted: ctx.message }
      );
    } catch (err) {
      await ctx.reply(`${mess.error}\n${err.message}`);
    }
  },
};

const ttmp3Command = {
  name: "ttmp3",
  category: "download",
  description: "Download audio dari video TikTok.",
  async execute(ctx) {
    if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}ttmp3 https://vt.tiktok.com/xxxxx`);
    await ctx.reply(mess.wait);
    try {
      const result = await fetchTikTok(ctx.text);
      await ctx.sock.sendMessage(
        ctx.from,
        { audio: { url: result.music }, mimetype: "audio/mpeg" },
        { quoted: ctx.message }
      );
    } catch (err) {
      await ctx.reply(`${mess.error}\n${err.message}`);
    }
  },
};

module.exports = [ttCommand, ttmp3Command];
