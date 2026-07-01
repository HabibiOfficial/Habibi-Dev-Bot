// commands/group/membership.js
// Command manajemen anggota grup: promote, demote, kick, add, dst.

const mess = require("../../lib/messages");
const { getGroupMetadata, normalizeNumber } = require("../../lib/permissions");

/** Ambil daftar JID target dari mention atau reply, atau dari argumen nomor manual. */
function getTargetJids(ctx) {
  const mentioned = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (mentioned.length) return mentioned;

  const quotedParticipant = ctx.message.message?.extendedTextMessage?.contextInfo?.participant;
  if (quotedParticipant) return [quotedParticipant];

  if (ctx.args[0]) {
    const num = normalizeNumber(ctx.args[0]);
    if (num) return [`${num}@s.whatsapp.net`];
  }

  return [];
}

function memberCommand(opts) {
  return {
    category: "group",
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    ...opts,
  };
}

module.exports = [
  memberCommand({
    name: "promote",
    aliases: ["jadiadmin"],
    description: "Jadikan member sebagai admin grup.",
    async execute(ctx) {
      const targets = getTargetJids(ctx);
      if (!targets.length) return ctx.reply("⚠️ Tag atau reply member yang mau dipromote.");
      await ctx.sock.groupParticipantsUpdate(ctx.from, targets, "promote");
      await ctx.reply(mess.done);
    },
  }),
  memberCommand({
    name: "demote",
    aliases: ["turonadmin"],
    description: "Turunkan admin jadi member biasa.",
    async execute(ctx) {
      const targets = getTargetJids(ctx);
      if (!targets.length) return ctx.reply("⚠️ Tag atau reply admin yang mau didemote.");
      await ctx.sock.groupParticipantsUpdate(ctx.from, targets, "demote");
      await ctx.reply(mess.done);
    },
  }),
  memberCommand({
    name: "kick",
    aliases: ["keluarkan"],
    description: "Keluarkan member dari grup.",
    async execute(ctx) {
      const targets = getTargetJids(ctx);
      if (!targets.length) return ctx.reply("⚠️ Tag atau reply member yang mau dikick.");
      await ctx.sock.groupParticipantsUpdate(ctx.from, targets, "remove");
      await ctx.reply(mess.done);
    },
  }),
  memberCommand({
    name: "kickall",
    description: "Keluarkan banyak member sekaligus (tag semua target).",
    async execute(ctx) {
      const targets = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!targets.length) return ctx.reply("⚠️ Tag member-member yang mau dikick.");
      await ctx.sock.groupParticipantsUpdate(ctx.from, targets, "remove");
      await ctx.reply(mess.done);
    },
  }),
  memberCommand({
    name: "add",
    aliases: ["tambah"],
    description: "Tambahkan member baru ke grup lewat nomor WA.",
    async execute(ctx) {
      const num = normalizeNumber(ctx.args[0] || "");
      if (!num) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}add 6281234567890`);
      await ctx.sock.groupParticipantsUpdate(ctx.from, [`${num}@s.whatsapp.net`], "add");
      await ctx.reply(mess.done);
    },
  }),
  memberCommand({
    name: "kickinactive",
    description: "Keluarkan member yang tidak pernah kirim pesan (butuh data aktivitas, placeholder).",
    async execute(ctx) {
      await ctx.reply(
        "⚙️ Fitur ini butuh tracking aktivitas member secara historis, belum tersedia di versi ini."
      );
    },
  }),
  memberCommand({
    name: "cleangrup",
    description: "Keluarkan member yang sudah keluar dari WhatsApp (nomor tidak aktif).",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur pengecekan nomor non-aktif belum tersedia di versi ini.");
    },
  }),
  memberCommand({
    name: "copymember",
    aliases: ["curimember", "stealmbr"],
    description: "Ambil daftar member grup ini untuk ditambahkan ke grup lain.",
    async execute(ctx) {
      const metadata = await getGroupMetadata(ctx);
      const list = metadata.participants.map((p) => p.id.split("@")[0]).join("\n");
      await ctx.reply(`👥 *Daftar Member (${metadata.participants.length})*\n\n${list}`);
    },
  }),
  memberCommand({
    name: "topaktif",
    description: "Menampilkan member paling aktif (butuh tracking pesan, placeholder).",
    async execute(ctx) {
      await ctx.reply("⚙️ Fitur tracking member aktif belum tersedia di versi ini.");
    },
  }),
  memberCommand({
    name: "topmember",
    description: "Menampilkan urutan member berdasarkan lama bergabung.",
    async execute(ctx) {
      const metadata = await getGroupMetadata(ctx);
      const list = metadata.participants.slice(0, 10).map((p, i) => `${i + 1}. ${p.id.split("@")[0]}`).join("\n");
      await ctx.reply(`🏆 *Top Member*\n\n${list}`);
    },
  }),
];
