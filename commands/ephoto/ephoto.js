// commands/ephoto/ephoto.js
// Kategori EPHOTO (15 cmd) — efek teks dari ephoto360.com, via API factory.

const { buildTextCommandSet } = require("../../lib/styleFactory");

module.exports = buildTextCommandSet("ephoto", [
  { name: "glitchtext", endpoint: "/ephoto/glitchtext", example: "glitchtext Nama Kamu" },
  { name: "neonglitch", endpoint: "/ephoto/neonglitch", example: "neonglitch Nama Kamu" },
  { name: "glowingtext", endpoint: "/ephoto/glowingtext", example: "glowingtext Nama Kamu" },
  { name: "gradienttext", endpoint: "/ephoto/gradienttext", example: "gradienttext Nama Kamu" },
  { name: "luxurygold", endpoint: "/ephoto/luxurygold", example: "luxurygold Nama Kamu" },
  { name: "watercolortext", endpoint: "/ephoto/watercolortext", example: "watercolortext Nama Kamu" },
  { name: "galaxystyle", endpoint: "/ephoto/galaxystyle", example: "galaxystyle Nama Kamu" },
  { name: "summerbeach", endpoint: "/ephoto/summerbeach", example: "summerbeach Nama Kamu" },
  { name: "royaltext", endpoint: "/ephoto/royaltext", example: "royaltext Nama Kamu" },
  { name: "effectclouds", endpoint: "/ephoto/effectclouds", example: "effectclouds Nama Kamu" },
  { name: "rainytext", endpoint: "/ephoto/rainytext", example: "rainytext Nama Kamu" },
  { name: "cartoonstyle", endpoint: "/ephoto/cartoonstyle", example: "cartoonstyle Nama Kamu" },
  { name: "papercutstyle", endpoint: "/ephoto/papercutstyle", example: "papercutstyle Nama Kamu" },
  { name: "underwatertext", endpoint: "/ephoto/underwatertext", example: "underwatertext Nama Kamu" },
  { name: "pixelglitch", endpoint: "/ephoto/pixelglitch", example: "pixelglitch Nama Kamu" },
]);
