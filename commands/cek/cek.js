// commands/cek/cek.js
// Kategori "CEK" — cek kepribadian/karakter, hiburan semata. Semua dihitung lokal
// memakai seededPercent supaya hasil konsisten untuk nama/teks yang sama.

const { seededPercent } = require("../../lib/utils");

const CEK_TYPES = [
  { name: "cekcantik", aliases: ["cantik"], label: "Kecantikan", emoji: "😍" },
  { name: "cekganteng", aliases: ["ganteng"], label: "Kegantengan", emoji: "😎" },
  { name: "cekwibu", aliases: ["wibu"], label: "Level Wibu", emoji: "🇯🇵" },
  { name: "cekotaku", aliases: ["otaku"], label: "Level Otaku", emoji: "🎌" },
  { name: "cekgamer", aliases: ["gamer"], label: "Skill Gamer", emoji: "🎮" },
  { name: "cekhoki", aliases: ["hoki"], label: "Keberuntungan", emoji: "🍀" },
  { name: "cekjodoh", aliases: ["jodoh"], label: "Kesiapan Jodoh", emoji: "💍" },
  { name: "cekkaya", aliases: ["kaya"], label: "Aura Kekayaan", emoji: "💰" },
  { name: "cekpintar", aliases: ["pintar"], label: "Kecerdasan", emoji: "🧠" },
  { name: "ceksetia", aliases: ["setia"], label: "Kesetiaan", emoji: "💞" },
  { name: "cekbucin", aliases: ["bucin"], label: "Level Bucin", emoji: "🥺" },
  { name: "cekjones", aliases: ["jones"], label: "Level Jomblo Ngenes", emoji: "😭" },
  { name: "cekkeren", aliases: ["keren"], label: "Kekerenan", emoji: "🕶️" },
  { name: "ceklucu", aliases: ["lucu"], label: "Tingkat Kelucuan", emoji: "🤣" },
  { name: "cekbaik", aliases: ["baik"], label: "Kebaikan Hati", emoji: "😇" },
  { name: "cekjahat", aliases: ["jahat"], label: "Tingkat Kejahatan", emoji: "😈" },
  { name: "cekalim", aliases: ["alim"], label: "Tingkat Kealiman", emoji: "🙏" },
  { name: "cekgalau", aliases: ["galau"], label: "Level Galau", emoji: "😔" },
  { name: "ceksabar", aliases: ["sabar"], label: "Tingkat Kesabaran", emoji: "🧘" },
  { name: "cekpd", aliases: ["pd"], label: "Rasa Percaya Diri", emoji: "💪" },
  { name: "cekrajin", aliases: ["rajin"], label: "Kerajinan", emoji: "📚" },
  { name: "cekmales", aliases: ["males"], label: "Tingkat Kemalasan", emoji: "🛌" },
  { name: "cekromantis", aliases: ["romantis"], label: "Tingkat Romantis", emoji: "🌹" },
  { name: "cekkuat", aliases: ["kuat"], label: "Kekuatan", emoji: "🦾" },
];

function buildCekCommand({ name, aliases, label, emoji }) {
  return {
    name,
    aliases,
    category: "cek",
    description: `Cek ${label.toLowerCase()} kamu atau orang lain (hiburan semata).`,
    async execute(ctx) {
      const target = ctx.text || ctx.sender.split("@")[0];
      const percent = seededPercent(`${name}-${target.toLowerCase()}-${new Date().toDateString()}`);
      await ctx.reply(
        `${emoji} *CEK ${label.toUpperCase()}*\n\n` +
          `Target : ${target}\n` +
          `Hasil  : *${percent}%*\n\n` +
          `_Hanya untuk hiburan, jangan dianggap serius_ 😄`
      );
    },
  };
}

module.exports = CEK_TYPES.map(buildCekCommand);
