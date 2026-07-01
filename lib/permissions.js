// lib/permissions.js
// Helper untuk mengecek berbagai syarat sebelum command dijalankan.
// Semua function menerima `ctx` yang disiapkan oleh lib/handler.js.

const config = require("../config");

/** Normalisasi nomor: buang @s.whatsapp.net / @g.us / karakter non-digit */
function normalizeNumber(jid = "") {
  return jid.split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
}

function isOwner(sender) {
  const senderNumber = normalizeNumber(sender);
  return config.ownerNumber.map(normalizeNumber).includes(senderNumber);
}

function isPrivateChat(ctx) {
  return !ctx.isGroup;
}

function isGroupChat(ctx) {
  return ctx.isGroup;
}

/** Ambil metadata grup sekali dan cache di ctx supaya tidak fetch berkali-kali. */
async function getGroupMetadata(ctx) {
  if (!ctx.isGroup) return null;
  if (ctx._groupMetadata) return ctx._groupMetadata;
  ctx._groupMetadata = await ctx.sock.groupMetadata(ctx.from);
  return ctx._groupMetadata;
}

async function isGroupAdmin(ctx) {
  if (!ctx.isGroup) return false;
  const metadata = await getGroupMetadata(ctx);
  const participant = metadata.participants.find((p) => p.id === ctx.sender);
  return Boolean(participant && (participant.admin === "admin" || participant.admin === "superadmin"));
}

async function isBotAdmin(ctx) {
  if (!ctx.isGroup) return false;
  const metadata = await getGroupMetadata(ctx);
  const botId = ctx.sock.user?.id ? ctx.sock.user.id.split(":")[0] + "@s.whatsapp.net" : "";
  const participant = metadata.participants.find((p) => normalizeNumber(p.id) === normalizeNumber(botId));
  return Boolean(participant && (participant.admin === "admin" || participant.admin === "superadmin"));
}

module.exports = {
  normalizeNumber,
  isOwner,
  isPrivateChat,
  isGroupChat,
  getGroupMetadata,
  isGroupAdmin,
  isBotAdmin,
};
