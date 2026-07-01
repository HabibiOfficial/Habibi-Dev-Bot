// commands/user/profile.js
// Sistem RPG sederhana: profile, exp/level, koin/saldo, daily claim, leaderboard.

const { getUser, updateUser, calculateLevel, getLeaderboard } = require("../../lib/database");
const { normalizeNumber } = require("../../lib/permissions");
const mess = require("../../lib/messages");

const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const DAILY_REWARD_KOIN = 100;
const DAILY_REWARD_EXP = 20;

module.exports = [
  {
    name: "profile",
    aliases: ["profil"],
    category: "user",
    description: "Menampilkan profil kamu (exp, level, koin).",
    async execute(ctx) {
      const user = getUser(ctx.sender);
      const level = calculateLevel(user.exp);
      const text =
        `👤 *PROFIL*\n\n` +
        `Nomor  : ${normalizeNumber(ctx.sender)}\n` +
        `Level  : ${level}\n` +
        `EXP    : ${user.exp}\n` +
        `Koin   : ${user.koin}`;
      await ctx.reply(text);
    },
  },
  {
    name: "daily",
    aliases: ["claim"],
    category: "user",
    description: "Klaim hadiah harian (koin + exp).",
    async execute(ctx) {
      const user = getUser(ctx.sender);
      const now = Date.now();
      const remaining = DAILY_COOLDOWN_MS - (now - user.lastClaim);

      if (remaining > 0) {
        const hours = Math.ceil(remaining / 1000 / 60 / 60);
        return ctx.reply(`⏱️ Kamu sudah klaim hari ini. Coba lagi dalam ${hours} jam.`);
      }

      const updated = updateUser(ctx.sender, {
        koin: user.koin + DAILY_REWARD_KOIN,
        exp: user.exp + DAILY_REWARD_EXP,
        lastClaim: now,
      });

      await ctx.reply(
        `🎁 *DAILY CLAIM*\n\n+${DAILY_REWARD_KOIN} Koin\n+${DAILY_REWARD_EXP} EXP\n\n` +
          `Total Koin: ${updated.koin}\nTotal EXP: ${updated.exp}`
      );
    },
  },
  {
    name: "exp",
    aliases: ["xp"],
    category: "user",
    description: "Cek EXP dan level kamu saat ini.",
    async execute(ctx) {
      const user = getUser(ctx.sender);
      const level = calculateLevel(user.exp);
      const expToNextLevel = level * 100 - user.exp;
      await ctx.reply(`✨ EXP: ${user.exp}\n🎚️ Level: ${level}\n📈 Butuh ${expToNextLevel} EXP lagi untuk naik level.`);
    },
  },
  {
    name: "koin",
    aliases: ["saldo"],
    category: "user",
    description: "Cek saldo koin kamu.",
    async execute(ctx) {
      const user = getUser(ctx.sender);
      await ctx.reply(`💰 Saldo koin kamu: *${user.koin}*`);
    },
  },
  {
    name: "leaderboard",
    aliases: ["top"],
    category: "user",
    description: "Menampilkan 10 pengguna dengan EXP tertinggi.",
    async execute(ctx) {
      const board = getLeaderboard(10, "exp");
      if (!board.length) return ctx.reply("📉 Belum ada data leaderboard.");

      const text = board
        .map((u, i) => `${i + 1}. ${normalizeNumber(u.userId)} — Lv.${calculateLevel(u.exp)} (${u.exp} exp)`)
        .join("\n");

      await ctx.reply(`🏆 *LEADERBOARD EXP*\n\n${text}`);
    },
  },
];
