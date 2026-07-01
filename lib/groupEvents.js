// lib/groupEvents.js
// Menangani event "group-participants-update" dari Baileys:
// welcome member baru, notifikasi promote/demote admin, dan pesan saat member keluar/di-kick.

const { getGroupSettings } = require("./database");
const cfg = require("../config");

function mentionName(jid) {
  return `@${jid.split("@")[0]}`;
}

async function onGroupParticipantsUpdate(sock, event) {
  const { id: groupId, participants, action } = event;
  const settings = getGroupSettings(groupId);

  let groupName = groupId;
  try {
    const metadata = await sock.groupMetadata(groupId);
    groupName = metadata.subject;
  } catch {
    // ignore, pakai id grup sebagai fallback nama
  }

  for (const participant of participants) {
    const mention = mentionName(participant);

    if (action === "add" && settings.welcome) {
      await sock.sendMessage(groupId, {
        text:
          `👋 Selamat datang ${mention} di *${groupName}*!\n\n` +
          `Semoga betah dan jangan lupa baca deskripsi grup ya.\n${cfg.watermark}`,
        mentions: [participant],
      });
    }

    if (action === "remove" && settings.welcome) {
      await sock.sendMessage(groupId, {
        text: `👋 ${mention} telah meninggalkan grup *${groupName}*.`,
        mentions: [participant],
      });
    }

    if (action === "promote") {
      await sock.sendMessage(groupId, {
        text:
          `🎉 *PROMOTE ADMIN*\n\n` +
          `👤 User  : ${mention}\n` +
          `🛡️ Role  : Group Admin\n` +
          `✅ Status: Dipromote\n\n${cfg.watermark}`,
        mentions: [participant],
      });
    }

    if (action === "demote") {
      await sock.sendMessage(groupId, {
        text:
          `⬇️ *DEMOTE ADMIN*\n\n` +
          `👤 User  : ${mention}\n` +
          `🛡️ Role  : Member Biasa\n` +
          `✅ Status: Diturunkan\n\n${cfg.watermark}`,
        mentions: [participant],
      });
    }
  }
}

module.exports = { onGroupParticipantsUpdate };
