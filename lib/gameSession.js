// lib/gameSession.js
// Menyimpan sesi game yang sedang berjalan per-chat (in-memory, direset saat bot restart).
// Dipakai untuk game yang butuh menunggu jawaban user (tebakkata, susunkata, dll).

const sessions = new Map();

function startSession(chatId, data) {
  sessions.set(chatId, { ...data, startedAt: Date.now() });
}

function getSession(chatId) {
  return sessions.get(chatId) || null;
}

function endSession(chatId) {
  sessions.delete(chatId);
}

module.exports = { startSession, getSession, endSession };
