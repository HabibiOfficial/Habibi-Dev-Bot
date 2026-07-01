// data/religiData.js
// Dataset lokal untuk fitur religi: 99 Asmaul Husna, doa harian, kisah nabi ringkas.

const asmaulHusna = [
  { arab: "الله", latin: "Allah", arti: "Allah" },
  { arab: "الرحمن", latin: "Ar Rahman", arti: "Yang Maha Pemurah" },
  { arab: "الرحيم", latin: "Ar Rahiim", arti: "Yang Maha Pengasih" },
  { arab: "الملك", latin: "Al Malik", arti: "Yang Maha Merajai/Memerintah" },
  { arab: "القدوس", latin: "Al Quddus", arti: "Yang Maha Suci" },
  // Dataset lengkap 99 nama sebaiknya diisi penuh sebelum production; ini contoh 5 pertama.
];

const doaHarian = [
  { judul: "Doa Sebelum Makan", teks: "Allahumma barik lana fima razaqtana wa qina 'adzabannar." },
  { judul: "Doa Bangun Tidur", teks: "Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur." },
  { judul: "Doa Keluar Rumah", teks: "Bismillahi tawakkaltu 'alallah, la haula wala quwwata illa billah." },
  { judul: "Doa Sebelum Belajar", teks: "Rabbi zidni 'ilma warzuqni fahma." },
];

const kisahNabi = [
  { nabi: "Nabi Adam AS", ringkasan: "Manusia pertama yang diciptakan Allah dan menjadi khalifah pertama di bumi." },
  { nabi: "Nabi Nuh AS", ringkasan: "Dikenal karena membangun kapal besar untuk menyelamatkan umatnya dari banjir besar." },
  { nabi: "Nabi Ibrahim AS", ringkasan: "Bapak para nabi, dikenal karena keteguhan iman dan kesediaannya berkurban." },
  { nabi: "Nabi Muhammad SAW", ringkasan: "Nabi dan Rasul terakhir, penutup para nabi, pembawa risalah Islam bagi seluruh umat." },
];

module.exports = { asmaulHusna, doaHarian, kisahNabi };
