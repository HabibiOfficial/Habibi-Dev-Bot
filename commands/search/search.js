// commands/search/search.js
// Kategori SEARCH (7 cmd) — pencarian Brainly, Wattpad, jadwal bola, puisi, dll.
// Karena screenshot user hanya menunjukkan ".brainly" secara utuh (6 command lain
// terpotong), 6 command lain diisi dengan tebakan yang paling wajar untuk kategori
// "Brainly, Wattpad, bola & puisi" dan tetap bisa diubah/ditambah dengan mudah.

const { buildTextCommandSet } = require("../../lib/styleFactory");

module.exports = buildTextCommandSet("search", [
  { name: "brainly", endpoint: "/search/brainly", example: "brainly rumus luas segitiga" },
  { name: "wattpad", endpoint: "/search/wattpad", example: "wattpad judul cerita" },
  { name: "jadwalbola", endpoint: "/search/jadwalbola", example: "jadwalbola liga inggris" },
  { name: "klasemenbola", endpoint: "/search/klasemenbola", example: "klasemenbola liga inggris" },
  { name: "carilirik", endpoint: "/search/lyrics", example: "carilirik judul lagu" },
  { name: "cariresep", endpoint: "/search/resep", example: "cariresep nasi goreng" },
  { name: "cariberita", endpoint: "/search/berita", example: "cariberita teknologi terbaru" },
]);
