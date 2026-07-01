// commands/canvas/canvas.js
// Kategori CANVAS (10 cmd) — fake generator berbasis gambar, via API factory.

const { buildImageCommandSet } = require("../../lib/styleFactory");

module.exports = buildImageCommandSet("canvas", [
  { name: "wanted", endpoint: "/canvas/wanted" },
  { name: "wantedposter", endpoint: "/canvas/wanted" },
  { name: "wasted", endpoint: "/canvas/wasted" },
  { name: "gta", endpoint: "/canvas/wasted" },
  { name: "jail", endpoint: "/canvas/jail" },
  { name: "penjara", endpoint: "/canvas/jail" },
  { name: "ektp", endpoint: "/canvas/ektp" },
  { name: "ktp", endpoint: "/canvas/ektp" },
  { name: "fakediscord", endpoint: "/canvas/fakediscord" },
  { name: "fakedc", endpoint: "/canvas/fakediscord" },
]);
