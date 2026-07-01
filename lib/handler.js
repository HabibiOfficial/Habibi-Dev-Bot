// lib/handler.js
// Menangani setiap pesan masuk: parsing prefix, mencari command,
// mengecek permission (owner/group/admin/dll), lalu eksekusi.

const config = require("../config");
const mess = require("./messages");
const permissions = require("./permissions");
const { getGroupSettings } = require("./database");

function getPrefixes() {
  return Array.isArray(config.prefix) ? config.prefix : [config.prefix];
}

function extractText(message) {
  const m = message.message;
  if (!m) return "";
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ""
  );
}

/**
 * Cek semua flag permission yang dideklarasikan command.
 * Return string pesan error kalau ada yang gagal, atau null kalau semua lolos.
 */
async function checkPermissions(command, ctx) {
  if (command.ownerOnly && !permissions.isOwner(ctx.sender)) return mess.owner;
  if (command.groupOnly && !ctx.isGroup) return mess.group;
  if (command.privateOnly && ctx.isGroup) return mess.private;

  if (command.adminOnly && ctx.isGroup) {
    const admin = await permissions.isGroupAdmin(ctx);
    if (!admin && !permissions.isOwner(ctx.sender)) return mess.admin;
  }

  if (command.botAdminOnly && ctx.isGroup) {
    const botAdmin = await permissions.isBotAdmin(ctx);
    if (!botAdmin) return mess.botadmin;
  }

  if (command.premiumOnly) {
    // TODO: hubungkan ke sistem premium/sewa saat sudah tersedia.
    // Untuk sekarang owner dianggap selalu punya akses premium.
    if (!permissions.isOwner(ctx.sender)) return mess.prem;
  }

  return null;
}

async function handleMessage(sock, message, commands, startTime, stats) {
  if (!message.message || message.key.fromMe) return;

  const text = extractText(message).trim();
  if (!text) return;

  const prefixes = getPrefixes();
  const usedPrefix = prefixes.find((p) => text.startsWith(p));
  if (!usedPrefix) return; // bukan command, biarkan (bisa ditambah fitur chatbot AI nanti)

  const [rawCmd, ...args] = text.slice(usedPrefix.length).trim().split(/\s+/);
  const commandName = rawCmd.toLowerCase();
  if (!commandName) return;

  const command = commands.get(commandName);
  if (!command) return;

  const from = message.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const sender = isGroup ? message.key.participant : from;

  if (stats) stats.messageCount = (stats.messageCount || 0) + 1;

  const ctx = {
    sock,
    message,
    from,
    sender,
    isGroup,
    args,
    text: args.join(" "),
    usedPrefix,
    commandName,
    commands,
    startTime,
    stats,
    groupSettings: isGroup ? getGroupSettings(from) : null,
    reply: (content, extra = {}) =>
      sock.sendMessage(from, typeof content === "string" ? { text: content, ...extra } : content, {
        quoted: message,
      }),
  };

  const permissionError = await checkPermissions(command, ctx);
  if (permissionError) {
    await ctx.reply(permissionError);
    return;
  }

  try {
    await command.execute(ctx);
  } catch (err) {
    console.error(`[handler] Error menjalankan command "${commandName}":`, err);
    await ctx.reply(`❌ Terjadi kesalahan saat menjalankan ${usedPrefix}${commandName}\n${err.message}`);
  }
}

module.exports = { handleMessage, getPrefixes, extractText, checkPermissions };
