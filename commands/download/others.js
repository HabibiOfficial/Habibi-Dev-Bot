// commands/download/others.js
// Downloader platform lain (Instagram, Facebook, YouTube, Threads, Mediafire, dst).
// Setiap platform punya API/scraper berbeda dan sering berubah, jadi dibuat lewat
// styleFactory (config.api). Ganti endpoint di sini sesuai API yang owner gunakan.

const { buildTextCommandSet } = require("../../lib/styleFactory");

module.exports = buildTextCommandSet("download", [
  { name: "igdl", endpoint: "/downloader/instagram", paramName: "url", example: "igdl https://instagram.com/p/xxxx" },
  { name: "fbdl", endpoint: "/downloader/facebook", paramName: "url", example: "fbdl https://fb.watch/xxxx" },
  { name: "fbhd", endpoint: "/downloader/facebook-hd", paramName: "url", example: "fbhd https://fb.watch/xxxx" },
  { name: "ytmp3", endpoint: "/downloader/ytmp3", paramName: "url", example: "ytmp3 https://youtu.be/xxxx" },
  { name: "ytmp4", endpoint: "/downloader/ytmp4", paramName: "url", example: "ytmp4 https://youtu.be/xxxx" },
  { name: "threads", endpoint: "/downloader/threads", paramName: "url", example: "threads https://threads.net/xxxx" },
  { name: "mediafire", endpoint: "/downloader/mediafire", paramName: "url", example: "mediafire https://mediafire.com/xxxx" },
  { name: "capcut", endpoint: "/downloader/capcut", paramName: "url", example: "capcut https://capcut.com/xxxx" },
  { name: "soundcloud", endpoint: "/downloader/soundcloud", paramName: "url", example: "soundcloud https://soundcloud.com/xxxx" },
  { name: "terabox", aliases: ["tb"], endpoint: "/downloader/terabox", paramName: "url", example: "terabox https://terabox.com/xxxx" },
  { name: "snackvideodl", aliases: ["svdl"], endpoint: "/downloader/snackvideo", paramName: "url", example: "svdl https://snackvideo.com/xxxx" },
  { name: "pixeldraindl", aliases: ["pdl"], endpoint: "/downloader/pixeldrain", paramName: "url", example: "pdl https://pixeldrain.com/u/xxxx" },
  { name: "videy", aliases: ["videydl"], endpoint: "/downloader/videy", paramName: "url", example: "videy https://videy.co/xxxx" },
]);
