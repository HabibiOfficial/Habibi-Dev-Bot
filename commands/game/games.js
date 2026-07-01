// commands/game/games.js
// Game interaktif di grup: tebakkata, susunkata, caklontong, suit/rps.
// Jawaban dicek lewat listener terpisah di lib/gameListener.js (dipasang di index.js).

const { pickRandom } = require("../../lib/utils");
const gameData = require("../../data/gameData");
const { startSession, endSession } = require("../../lib/gameSession");

function shuffleWord(word) {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join("").toUpperCase();
}

function quizCommand(name, aliases, dataset, title, timeoutMs = 60000) {
  return {
    name,
    aliases,
    category: "game",
    description: `Mulai game ${title}.`,
    async execute(ctx) {
      const soal = pickRandom(dataset);
      startSession(ctx.from, { type: name, jawaban: soal.jawaban.toLowerCase() });
      await ctx.reply(`🎲 *${title.toUpperCase()}*\n\n${soal.soal}\n\nJawab langsung di chat! (60 detik)`);
      setTimeout(() => {
        const session = require("../../lib/gameSession").getSession(ctx.from);
        if (session && session.type === name) {
          endSession(ctx.from);
          ctx.reply(`⌛ Waktu habis! Jawaban yang benar: *${soal.jawaban}*`);
        }
      }, timeoutMs);
    },
  };
}

module.exports = [
  quizCommand("tebakkata", ["tebakword"], gameData.tebakKata, "Tebak Kata"),
  quizCommand("caklontong", ["cak"], gameData.caklontong, "Cak Lontong"),
  {
    name: "susunkata",
    aliases: ["scramble"],
    category: "game",
    description: "Susun kata yang telah diacak hurufnya.",
    async execute(ctx) {
      const soal = pickRandom(gameData.tebakKata);
      const acak = shuffleWord(soal.jawaban);
      startSession(ctx.from, { type: "susunkata", jawaban: soal.jawaban.toLowerCase() });
      await ctx.reply(`🔤 *SUSUN KATA*\n\nSoal: ${soal.soal}\nHuruf acak: *${acak}*\n\nJawab di chat! (60 detik)`);
      setTimeout(() => {
        const session = require("../../lib/gameSession").getSession(ctx.from);
        if (session && session.type === "susunkata") {
          endSession(ctx.from);
          ctx.reply(`⌛ Waktu habis! Jawaban: *${soal.jawaban}*`);
        }
      }, 60000);
    },
  },
  {
    name: "suit",
    aliases: ["rps"],
    category: "game",
    description: "Main suit (batu gunting kertas) melawan bot.",
    async execute(ctx) {
      const choices = ["batu", "gunting", "kertas"];
      const userChoice = ctx.args[0]?.toLowerCase();
      if (!choices.includes(userChoice)) {
        return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}suit batu (pilihan: batu/gunting/kertas)`);
      }

      const botChoice = pickRandom(choices);
      let result;
      if (userChoice === botChoice) result = "Seri! 🤝";
      else if (
        (userChoice === "batu" && botChoice === "gunting") ||
        (userChoice === "gunting" && botChoice === "kertas") ||
        (userChoice === "kertas" && botChoice === "batu")
      ) {
        result = "Kamu Menang! 🎉";
      } else {
        result = "Kamu Kalah! 😢";
      }

      await ctx.reply(`✊✌️✋ *SUIT*\n\nKamu: ${userChoice}\nBot: ${botChoice}\n\n${result}`);
    },
  },
];
