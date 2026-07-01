// commands/tts/tts.js
// Text to Speech. .tts dan .say pakai Google Translate TTS endpoint (real, tanpa perlu API key).
// Command karakter (.ttsgoku, .ttseminem, dst) memerlukan model voice-cloning pihak ketiga,
// jadi dibuat lewat styleFactory (perlu config.api diisi).

const axios = require("axios");
const mess = require("../../lib/messages");
const { buildTextCommandSet } = require("../../lib/styleFactory");

/** Google Translate TTS: gratis, tanpa API key, cocok untuk .tts dasar. */
function googleTtsUrl(text, lang = "id") {
  const encoded = encodeURIComponent(text.slice(0, 200)); // limit Google TTS ~200 char per request
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;
}

const basicTts = {
  name: "tts",
  aliases: ["say"],
  category: "tts",
  description: "Ubah teks menjadi suara (Text to Speech).",
  async execute(ctx) {
    if (!ctx.text) return ctx.reply(`⚠️ Contoh: ${ctx.usedPrefix}tts halo semua!`);

    try {
      const url = googleTtsUrl(ctx.text);
      const { data } = await axios.get(url, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 15000,
      });
      await ctx.sock.sendMessage(
        ctx.from,
        { audio: Buffer.from(data), mimetype: "audio/mpeg", ptt: true },
        { quoted: ctx.message }
      );
    } catch (err) {
      await ctx.reply(`${mess.error}\n${err.message}`);
    }
  },
};

// Karakter TTS (butuh API voice-cloning eksternal, misal ElevenLabs/sejenis)
const characterTts = buildTextCommandSet("tts", [
  { name: "ttsgoku", endpoint: "/tts/goku", example: "ttsgoku halo semua!" },
  { name: "ttseminem", endpoint: "/tts/eminem", example: "ttseminem halo semua!" },
  { name: "ttsmickey", endpoint: "/tts/mickey", example: "ttsmickey halo semua!" },
  { name: "ttsnahida", endpoint: "/tts/nahida", example: "ttsnahida halo semua!" },
  { name: "ttselon", endpoint: "/tts/elon", example: "ttselon halo semua!" },
  { name: "ttsoptimus", endpoint: "/tts/optimus", example: "ttsoptimus halo semua!" },
]);

module.exports = [basicTts, ...characterTts];
