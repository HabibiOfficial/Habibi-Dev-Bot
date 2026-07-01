// commands/group/toggles.js
// Command untuk mengaktifkan/menonaktifkan fitur keamanan grup, disimpan di database.
// Contoh: .antilink on / .antilink off

const mess = require("../../lib/messages");
const { setGroupSetting, DEFAULT_GROUP_SETTINGS } = require("../../lib/database");

function toggleCommand(name, aliases, settingKey, label) {
  return {
    name,
    aliases,
    category: "group",
    groupOnly: true,
    adminOnly: true,
    description: `Aktifkan/nonaktifkan ${label}.`,
    async execute(ctx) {
      const mode = ctx.args[0]?.toLowerCase();
      if (!["on", "off"].includes(mode)) {
        const current = ctx.groupSettings[settingKey] ? "ON ✅" : "OFF ❌";
        return ctx.reply(
          `⚙️ *${label}* saat ini: ${current}\nContoh: ${ctx.usedPrefix}${name} on / ${ctx.usedPrefix}${name} off`
        );
      }
      setGroupSetting(ctx.from, settingKey, mode === "on");
      await ctx.reply(`✅ ${label} berhasil di-*${mode.toUpperCase()}*kan.`);
    },
  };
}

module.exports = [
  toggleCommand("antilink", [], "antiLink", "Anti-Link"),
  toggleCommand("antitoxic", [], "antiToxic", "Anti-Toxic"),
  toggleCommand("antispam", [], "antiSpam", "Anti-Spam"),
  toggleCommand("welcome", [], "welcome", "Welcome Message"),
  toggleCommand("antiraid", [], "antiRaid", "Anti-Raid"),
  toggleCommand("slowmode", [], "slowMode", "Slow Mode"),
  toggleCommand("verifikasi", [], "verifikasi", "Verifikasi Member Baru"),
  toggleCommand("lockprofile", ["lockprofil"], "lockProfil", "Lock Profil Grup"),
  toggleCommand("antinsfw", [], "antiNSFW", "Anti-NSFW"),
  toggleCommand("ocrantilink", [], "ocrAntiLink", "OCR Anti-Link"),
  toggleCommand("ocrantitoxic", [], "ocrAntiToxic", "OCR Anti-Toxic"),
  toggleCommand("lockgrup", ["proteksi"], "lockGrup", "Lock Grup (hanya admin yang bisa kirim pesan)"),
  toggleCommand("autoswgc", [], "autoStatusWaGc", "Auto Status WA ke Grup"),
  {
    name: "gpanel",
    category: "group",
    groupOnly: true,
    adminOnly: true,
    description: "Menampilkan panel manajemen grup lengkap.",
    async execute(ctx) {
      const s = ctx.groupSettings;
      const flag = (v) => (v ? "✅" : "❌");
      const { getGroupMetadata } = require("../../lib/permissions");
      const metadata = await getGroupMetadata(ctx);
      const admins = metadata.participants.filter((p) => p.admin).length;

      const text =
        `🛡️ *PANEL MANAJEMEN GRUP*\n\n` +
        `👥 Grup      : ${metadata.subject}\n` +
        `👑 Admin     : ${admins} orang\n` +
        `👤 Member    : ${metadata.participants.length} orang\n\n` +
        `⚙️ *Status Aktif:*\n` +
        Object.keys(DEFAULT_GROUP_SETTINGS)
          .map((key) => `${flag(s[key])} ${key}`)
          .join("\n") +
        `\n\nGunakan *${ctx.usedPrefix}<fitur> on/off* untuk mengatur.`;

      await ctx.reply(text);
    },
  },
];
