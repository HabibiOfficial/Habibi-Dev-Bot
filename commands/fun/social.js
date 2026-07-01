// commands/fun/social.js
// Command hiburan sosial: ship, truth/dare, confess/menfess, khodam, rate, dst.
// Semua real (dijalankan lokal tanpa API eksternal) memakai random generator & dataset lokal.

const { pickRandom, randomInt, seededPercent } = require("../../lib/utils");
const funData = require("../../data/funData");
const { normalizeNumber } = require("../../lib/permissions");

function getMentionOrArg(ctx) {
  const mentioned = ctx.message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (mentioned.length) return mentioned.map((m) => normalizeNumber(m)).join(" & ");
  return ctx.text || "seseorang";
}

module.exports = [
  {
    name: "ship",
    aliases: ["shipping"],
    category: "fun",
    description: "Cek persentase kecocokan (jodoh) dua nama/orang.",
    async execute(ctx) {
      const target = getMentionOrArg(ctx);
      const percent = randomInt(1, 100);
      await ctx.reply(`💘 *SHIP*\n\n${ctx.sender.split("@")[0]} + ${target}\nKecocokan: *${percent}%*`);
    },
  },
  {
    name: "truth",
    aliases: ["truthq"],
    category: "fun",
    description: "Dapatkan pertanyaan Truth acak.",
    async execute(ctx) {
      await ctx.reply(`🤔 *TRUTH*\n\n${pickRandom(funData.truths)}`);
    },
  },
  {
    name: "dare",
    aliases: ["tantang"],
    category: "fun",
    description: "Dapatkan tantangan Dare acak.",
    async execute(ctx) {
      await ctx.reply(`🔥 *DARE*\n\n${pickRandom(funData.dares)}`);
    },
  },
  {
    name: "confess",
    aliases: ["menfess"],
    category: "fun",
    description: "Kirim confess/menfess anonim ke grup.",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}confess pesan rahasia kamu`);
      await ctx.reply(`💌 *CONFESS ANONIM*\n\n"${ctx.text}"`);
    },
  },
  {
    name: "soulmatch",
    aliases: ["match"],
    category: "fun",
    description: "Cek kecocokan jiwa (soulmatch) acak.",
    async execute(ctx) {
      const percent = seededPercent(ctx.sender + new Date().toDateString());
      await ctx.reply(`✨ *SOULMATCH*\n\nHasil hari ini: *${percent}%* cocok dengan semesta!`);
    },
  },
  {
    name: "cekkhodam",
    aliases: ["khodam"],
    category: "fun",
    description: "Cek khodam pendamping kamu (hiburan semata).",
    async execute(ctx) {
      const khodam = pickRandom(funData.khodam);
      await ctx.reply(`👻 *CEK KHODAM*\n\nKhodam pendamping kamu: *${khodam}*\n\n(hanya hiburan, bukan hal serius 😄)`);
    },
  },
  {
    name: "rate",
    aliases: ["nilai"],
    category: "fun",
    description: "Beri rating acak 1-100 untuk sesuatu.",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}rate kucing`);
      const percent = seededPercent(ctx.text.toLowerCase());
      await ctx.reply(`⭐ *RATE*: "${ctx.text}"\n\nSkor: *${percent}/100*`);
    },
  },
  {
    name: "apakah",
    aliases: ["apa"],
    category: "fun",
    description: "Tanya bot pertanyaan ya/tidak.",
    async execute(ctx) {
      const jawaban = pickRandom(["Ya ✅", "Tidak ❌", "Mungkin 🤔", "Bisa jadi", "Kemungkinan besar iya"]);
      await ctx.reply(`🎱 ${jawaban}`);
    },
  },
  {
    name: "akankah",
    aliases: ["akan"],
    category: "fun",
    description: "Ramalan sederhana akan terjadi atau tidak.",
    async execute(ctx) {
      const jawaban = pickRandom(["Akan terjadi 🌟", "Tidak akan terjadi 🚫", "Masih belum pasti ⏳"]);
      await ctx.reply(`🔮 ${jawaban}`);
    },
  },
  {
    name: "mimpiworld",
    aliases: ["dream"],
    category: "fun",
    description: "Tafsir mimpi sederhana (hiburan).",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}mimpiworld terbang`);
      const tafsir = pickRandom([
        "pertanda hal baik akan datang.",
        "menandakan kamu sedang butuh istirahat.",
        "simbol perubahan besar dalam hidupmu.",
        "hanya bunga tidur, tidak ada arti khusus.",
      ]);
      await ctx.reply(`🌙 *TAFSIR MIMPI*: "${ctx.text}"\n\nKemungkinan artinya ${tafsir}`);
    },
  },
  {
    name: "siapa",
    aliases: ["who"],
    category: "fun",
    description: "Pilih member secara acak untuk pertanyaan lucu.",
    async execute(ctx) {
      if (!ctx.isGroup) return ctx.reply("👥 Command ini hanya bisa dipakai di Grup!");
      const { getGroupMetadata } = require("../../lib/permissions");
      const metadata = await getGroupMetadata(ctx);
      const target = pickRandom(metadata.participants).id;
      await ctx.sock.sendMessage(
        ctx.from,
        { text: `🎯 ${ctx.text || "Siapa yang paling kece?"}\n\nJawaban: @${target.split("@")[0]}`, mentions: [target] },
        { quoted: ctx.message }
      );
    },
  },
  {
    name: "puisi",
    aliases: ["sajak"],
    category: "fun",
    description: "Dapatkan puisi/sajak acak.",
    async execute(ctx) {
      await ctx.reply(`📝 *PUISI*\n\n${pickRandom(funData.puisi)}`);
    },
  },
];
