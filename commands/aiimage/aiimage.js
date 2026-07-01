// commands/aiimage/aiimage.js
// Kategori AI IMAGE (38 cmd) — generate/edit gambar dengan AI.
// Semua butuh API/model pihak ketiga, dibuat lewat styleFactory (config.api).

const { buildTextCommandSet, buildImageCommandSet } = require("../../lib/styleFactory");

// Text-to-image (generate dari prompt teks)
const textToImage = buildTextCommandSet("aiimage", [
  { name: "txt2img", endpoint: "/ai/txt2img", example: "txt2img kucing lucu di taman" },
  { name: "imagine", endpoint: "/ai/imagine", example: "imagine kota masa depan" },
  { name: "animegen", endpoint: "/ai/animegen", example: "animegen gadis berambut pink" },
  { name: "aianimegen", endpoint: "/ai/animegen", example: "aianimegen gadis berambut pink" },
  { name: "sora2", endpoint: "/ai/sora2", example: "sora2 pantai saat matahari terbenam" },
  { name: "soraai", endpoint: "/ai/sora2", example: "soraai pantai saat matahari terbenam" },
  { name: "nanobanana", endpoint: "/ai/nanobanana", example: "nanobanana karakter chibi lucu" },
  { name: "deepai2", endpoint: "/ai/deepai", example: "deepai2 pemandangan gunung" },
]);

// Image-to-image (edit/transform gambar yang di-reply)
const imageToImage = buildImageCommandSet("aiimage", [
  { name: "imgedit", endpoint: "/ai/imgedit" },
  { name: "removebg", endpoint: "/tools/removebg" },
  { name: "nobg", endpoint: "/tools/removebg" },
  { name: "toghibli", endpoint: "/ai/toghibli" },
  { name: "ghiblistyle", endpoint: "/ai/toghibli" },
  { name: "toanime", endpoint: "/ai/toanime" },
  { name: "animefy", endpoint: "/ai/toanime" },
  { name: "toblack", endpoint: "/ai/toblack" },
  { name: "tohitam", endpoint: "/ai/toblack" },
  { name: "tochibi", endpoint: "/ai/tochibi" },
  { name: "chibistyle", endpoint: "/ai/tochibi" },
  { name: "tofigure", endpoint: "/ai/tofigure" },
  { name: "figurestyle", endpoint: "/ai/tofigure" },
  { name: "tofigurev2", endpoint: "/ai/tofigure-v2" },
  { name: "tohijab", endpoint: "/ai/tohijab" },
  { name: "hijabstyle", endpoint: "/ai/tohijab" },
  { name: "tojapanese", endpoint: "/ai/tojapanese" },
  { name: "japanesestyle", endpoint: "/ai/tojapanese" },
  { name: "tomekah", endpoint: "/ai/tomekah" },
  { name: "meccabg", endpoint: "/ai/tomekah" },
  { name: "toemotebatu", endpoint: "/ai/toemotebatu" },
  { name: "to3d", endpoint: "/ai/to3d" },
  { name: "3dfy", endpoint: "/ai/to3d" },
  { name: "tocartoon", endpoint: "/ai/tocartoon" },
  { name: "cartoonify", endpoint: "/ai/tocartoon" },
  { name: "tomanga", endpoint: "/ai/tomanga" },
  { name: "mangafy", endpoint: "/ai/tomanga" },
  { name: "tooilpainting", endpoint: "/ai/tooilpainting" },
  { name: "oilpainting", endpoint: "/ai/tooilpainting" },
  { name: "tofigurine", endpoint: "/ai/tofigurine" },
  { name: "figurine", endpoint: "/ai/tofigurine" },
]);

module.exports = [...textToImage, ...imageToImage];
