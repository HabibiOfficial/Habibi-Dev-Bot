// lib/gameListener.js
// Mendengarkan pesan teks biasa (non-command) untuk mengecek apakah itu jawaban
// dari game yang sedang berjalan di chat tersebut (tebakkata, susunkata, dll).
// Dipasang terpisah dari handler command supaya tidak perlu prefix.

const { getSession, endSession } = require("./gameSession");
const { extractText } = require("./handler");

async function handleGameAnswer(sock, message) {
  if (!message.message || message.key.fromMe) return false;

  const from = message.key.remoteJid;
  const session = getSession(from);
  if (!session) return false;

  const text = extractText(message).trim().toLowerCase();
  if (!text) return false;

  if (text === session.jawaban) {
    endSession(from);
    await sock.sendMessage(from, { text: `✅ Benar! Jawabannya *${session.jawaban}*` }, { quoted: message });
    return true;
  }

  return false;
}

module.exports = { handleGameAnswer };
