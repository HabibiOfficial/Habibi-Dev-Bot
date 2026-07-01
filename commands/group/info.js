// commands/group/info.js
// Command untuk mengatur & menampilkan info grup: nama, deskripsi, foto, link, dst.

const mess = require("../../lib/messages");
const { getGroupMetadata } = require("../../lib/permissions");

function groupCommand(opts) {
  return { category: "group", groupOnly: true, ...opts };
}

function adminGroupCommand(opts) {
  return groupCommand({ adminOnly: true, botAdminOnly: true, ...opts });
}

module.exports = [
  adminGroupCommand({
    name: "setname",
    aliases: ["setnamegc"],
    description: "Ganti nama grup.",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}setname Nama Grup Baru`);
      await ctx.sock.groupUpdateSubject(ctx.from, ctx.text);
      await ctx.reply(mess.done);
    },
  }),
  adminGroupCommand({
    name: "setdesc",
    description: "Ganti deskripsi grup.",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}setdesc Deskripsi baru`);
      await ctx.sock.groupUpdateDescription(ctx.from, ctx.text);
      await ctx.reply(mess.done);
    },
  }),
  adminGroupCommand({
    name: "cleardesc",
    description: "Kosongkan deskripsi grup.",
    async execute(ctx) {
      await ctx.sock.groupUpdateDescription(ctx.from, "");
      await ctx.reply(mess.done);
    },
  }),
  groupCommand({
    name: "infogc",
    aliases: ["groupinfo"],
    description: "Menampilkan informasi lengkap grup.",
    async execute(ctx) {
      const metadata = await getGroupMetadata(ctx);
      const admins = metadata.participants.filter((p) => p.admin).length;
      const text =
        `ℹ️ *INFO GRUP*\n\n` +
        `Nama    : ${metadata.subject}\n` +
        `ID      : ${metadata.id}\n` +
        `Member  : ${metadata.participants.length}\n` +
        `Admin   : ${admins}\n` +
        `Deskripsi:\n${metadata.desc || "-"}`;
      await ctx.reply(text);
    },
  }),
  adminGroupCommand({
    name: "setppgc",
    aliases: ["fotogrup"],
    description: "Ganti foto profil grup (reply gambar).",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur update foto grup memerlukan pengunduhan media, belum tersambung di versi ini.");
    },
  }),
  groupCommand({
    name: "copygc",
    description: "Salin pengaturan grup ini ke grup lain (nama & deskripsi).",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur copy pengaturan antar grup belum tersedia di versi ini.");
    },
  }),
  adminGroupCommand({
    name: "pin",
    aliases: ["pinpesan"],
    description: "Pin pesan yang di-reply.",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur pin pesan bergantung dukungan pinMessage pada versi library, belum aktif.");
    },
  }),
  adminGroupCommand({
    name: "unpin",
    aliases: ["unpinpesan"],
    description: "Unpin pesan yang di-reply.",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur unpin pesan bergantung dukungan pinMessage pada versi library, belum aktif.");
    },
  }),
  adminGroupCommand({
    name: "revoke",
    aliases: ["resetlink"],
    description: "Reset link invite grup.",
    async execute(ctx) {
      const newCode = await ctx.sock.groupRevokeInvite(ctx.from);
      await ctx.reply(`🔗 Link baru: https://chat.whatsapp.com/${newCode}`);
    },
  }),
  adminGroupCommand({
    name: "setjoin",
    aliases: ["joinapproval"],
    description: "Aktifkan/nonaktifkan approval untuk join grup.",
    async execute(ctx) {
      const mode = ctx.args[0]?.toLowerCase();
      if (!["on", "off"].includes(mode)) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}setjoin on`);
      await ctx.sock.groupJoinApprovalMode(ctx.from, mode === "on" ? "on" : "off");
      await ctx.reply(mess.done);
    },
  }),
  adminGroupCommand({
    name: "backupgrup",
    description: "Backup data pengaturan grup saat ini.",
    async execute(ctx) {
      const { getGroupSettings } = require("../../lib/database");
      const settings = getGroupSettings(ctx.from);
      await ctx.reply(`💾 *Backup Setting Grup*\n\n${JSON.stringify(settings, null, 2)}`);
    },
  }),
];
