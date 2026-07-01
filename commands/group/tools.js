// commands/group/tools.js
// Command "alat" grup: tagall, hidetag, delete pesan, dst.

const mess = require("../../lib/messages");
const { getGroupMetadata } = require("../../lib/permissions");

module.exports = [
  {
    name: "tagall",
    aliases: ["everyone"],
    category: "group",
    groupOnly: true,
    adminOnly: true,
    description: "Tag semua member grup.",
    async execute(ctx) {
      const metadata = await getGroupMetadata(ctx);
      const mentions = metadata.participants.map((p) => p.id);
      const text = `📢 *TAG ALL*\n${ctx.text || "Perhatian untuk semua member!"}\n\n` +
        mentions.map((m) => `@${m.split("@")[0]}`).join(" ");
      await ctx.sock.sendMessage(ctx.from, { text, mentions }, { quoted: ctx.message });
    },
  },
  {
    name: "hidetag",
    aliases: ["h"],
    category: "group",
    groupOnly: true,
    adminOnly: true,
    description: "Kirim pesan dengan mention tersembunyi ke semua member.",
    async execute(ctx) {
      const metadata = await getGroupMetadata(ctx);
      const mentions = metadata.participants.map((p) => p.id);
      await ctx.sock.sendMessage(ctx.from, { text: ctx.text || " ", mentions }, { quoted: ctx.message });
    },
  },
  {
    name: "delete",
    aliases: ["del"],
    category: "group",
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    description: "Hapus pesan yang di-reply.",
    async execute(ctx) {
      const quotedInfo = ctx.message.message?.extendedTextMessage?.contextInfo;
      if (!quotedInfo?.stanzaId) return ctx.reply("⚠️ Reply pesan yang mau dihapus.");
      await ctx.sock.sendMessage(ctx.from, {
        delete: {
          remoteJid: ctx.from,
          fromMe: false,
          id: quotedInfo.stanzaId,
          participant: quotedInfo.participant,
        },
      });
    },
  },
];
