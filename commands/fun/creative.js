// commands/fun/creative.js
// Command hiburan berbasis API pihak ketiga (sticker/quotes/wallpaper/emojimix/pinterest)
// dibuat lewat styleFactory karena semuanya butuh endpoint eksternal.

const { buildTextCommandSet } = require("../../lib/styleFactory");

module.exports = buildTextCommandSet("fun", [
  { name: "quotesimage", endpoint: "/maker/quotes", example: "quotesimage teks kata bijak" },
  { name: "wallpaper", endpoint: "/search/wallpaper", example: "wallpaper naruto" },
  { name: "emojimix", endpoint: "/maker/emojimix", example: "emojimix 😂+😭" },
  { name: "pinterest", endpoint: "/search/pinterest", example: "pinterest anime girl" },
]);
