// commands/religi/religi.js
// Fitur religi: jadwal sholat (API publik myquran.com), asmaul husna, kisah nabi, doa harian.

const axios = require("axios");
const { pickRandom } = require("../../lib/utils");
const { asmaulHusna, doaHarian, kisahNabi } = require("../../data/religiData");
const mess = require("../../lib/messages");

module.exports = [
  {
    name: "jadwalsholat",
    aliases: ["sholat2"],
    category: "religi",
    description: "Cek jadwal sholat hari ini berdasarkan kota.",
    async execute(ctx) {
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}jadwalsholat Jakarta`);

      try {
        const searchRes = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(ctx.text)}`);
        const kota = searchRes.data?.data?.[0];
        if (!kota) return ctx.reply(mess.notFound);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");

        const jadwalRes = await axios.get(
          `https://api.myquran.com/v2/sholat/jadwal/${kota.id}/${yyyy}/${mm}/${dd}`
        );
        const j = jadwalRes.data?.data?.jadwal;
        if (!j) return ctx.reply(mess.notFound);

        const text =
          `🕌 *JADWAL SHOLAT - ${kota.lokasi}*\n${j.tanggal}\n\n` +
          `Imsak    : ${j.imsak}\n` +
          `Subuh    : ${j.subuh}\n` +
          `Terbit   : ${j.terbit}\n` +
          `Dzuhur   : ${j.dzuhur}\n` +
          `Ashar    : ${j.ashar}\n` +
          `Maghrib  : ${j.maghrib}\n` +
          `Isya     : ${j.isya}`;
        await ctx.reply(text);
      } catch (err) {
        await ctx.reply(`${mess.error}\n${err.message}`);
      }
    },
  },
  {
    name: "asmaulhusna",
    aliases: ["asmaul"],
    category: "religi",
    description: "Menampilkan salah satu dari 99 Asmaul Husna secara acak.",
    async execute(ctx) {
      const item = pickRandom(asmaulHusna);
      await ctx.reply(`📿 *ASMAUL HUSNA*\n\n${item.arab}\n${item.latin}\nArti: ${item.arti}`);
    },
  },
  {
    name: "kisahnabi",
    aliases: ["nabi"],
    category: "religi",
    description: "Menampilkan kisah singkat salah satu Nabi secara acak.",
    async execute(ctx) {
      const item = pickRandom(kisahNabi);
      await ctx.reply(`📖 *KISAH NABI*\n\n*${item.nabi}*\n${item.ringkasan}`);
    },
  },
  {
    name: "doa",
    aliases: ["doaharian"],
    category: "religi",
    description: "Menampilkan doa harian secara acak.",
    async execute(ctx) {
      const item = pickRandom(doaHarian);
      await ctx.reply(`🤲 *${item.judul.toUpperCase()}*\n\n${item.teks}`);
    },
  },
];
