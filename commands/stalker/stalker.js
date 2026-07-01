// commands/stalker/stalker.js
// Kategori STALKER (8 cmd) — cek info akun sosmed/game publik.
// .githubstalk/.ghstalk dibuat real (API GitHub publik, tanpa key).
// Sisanya (Instagram/TikTok/FreeFire) via API factory karena butuh scraper/API pihak ketiga.

const axios = require("axios");
const mess = require("../../lib/messages");
const { buildTextCommandSet } = require("../../lib/styleFactory");

const githubStalk = {
  name: "githubstalk",
  aliases: ["ghstalk"],
  category: "stalker",
  description: "Cek info profil GitHub.",
  async execute(ctx) {
    if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}githubstalk octocat`);
    try {
      const { data } = await axios.get(`https://api.github.com/users/${encodeURIComponent(ctx.text)}`, {
        timeout: 15000,
      });
      const text =
        `🐙 *GITHUB STALK*\n\n` +
        `Nama       : ${data.name || "-"}\n` +
        `Username   : ${data.login}\n` +
        `Bio        : ${data.bio || "-"}\n` +
        `Repo       : ${data.public_repos}\n` +
        `Followers  : ${data.followers}\n` +
        `Following  : ${data.following}\n` +
        `Profil     : ${data.html_url}`;
      await ctx.reply({ image: { url: data.avatar_url }, caption: text });
    } catch (err) {
      const msg = err.response?.status === 404 ? "Username GitHub tidak ditemukan." : err.message;
      await ctx.reply(`${mess.error}\n${msg}`);
    }
  },
};

const socialStalk = buildTextCommandSet("stalker", [
  { name: "igstalk", aliases: ["instagramstalk"], endpoint: "/stalk/instagram", paramName: "username", example: "igstalk namauser" },
  { name: "tiktokstalk", aliases: ["ttstalk"], endpoint: "/stalk/tiktok", paramName: "username", example: "tiktokstalk namauser" },
  { name: "ffstalk", aliases: ["stalkff"], endpoint: "/stalk/freefire", paramName: "id", example: "ffstalk 123456789" },
]);

module.exports = [githubStalk, ...socialStalk];
