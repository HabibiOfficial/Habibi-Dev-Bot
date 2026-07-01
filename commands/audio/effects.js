// commands/audio/effects.js
// Efek audio nyata memakai ffmpeg audio filter, dijalankan pada audio yang di-reply.

const { getQuotedMessage } = require("../../lib/utils");
const { isFfmpegAvailable, applyAudioFilter } = require("../../lib/audioEffect");
const mess = require("../../lib/messages");

const FILTERS = {
  bass: "bass=g=20",
  bassboost: "bass=g=20",
  slow: "atempo=0.75",
  slowed: "atempo=0.75",
  fast: "atempo=1.5",
  speed: "atempo=1.5",
  robot: "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)'",
  robotvoice: "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)'",
  reverse: "areverse",
  balik: "areverse",
  earrape: "volume=8,acrusher=.1:1:64:0:log",
  loud: "volume=5",
  echo: "aecho=0.8:0.9:1000:0.3",
  gema: "aecho=0.8:0.9:1000:0.3",
  tupai: "asetrate=44100*1.25,aresample=44100",
  chipmunk: "asetrate=44100*1.5,aresample=44100",
};

function audioEffectCommand(name, aliases, filter, label) {
  return {
    name,
    aliases,
    category: "audio",
    description: `Terapkan efek audio: ${label}.`,
    async execute(ctx) {
      const quoted = getQuotedMessage(ctx.message);
      const hasDirectAudio = ctx.message.message?.audioMessage;
      if (!quoted?.audioMessage && !hasDirectAudio) {
        return ctx.reply(`⚠️ Reply/kirim audio dengan caption ${ctx.usedPrefix}${name}`);
      }
      if (!isFfmpegAvailable()) {
        return ctx.reply("⚙️ ffmpeg belum terpasang di sistem. Install `ffmpeg` untuk mengaktifkan fitur ini.");
      }

      try {
        const { downloadMediaMessage } = require("baileys");
        const targetMsg = quoted
          ? { message: quoted, key: ctx.message.message.extendedTextMessage.contextInfo }
          : ctx.message;
        const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
        const result = await applyAudioFilter(buffer, filter);
        await ctx.sock.sendMessage(ctx.from, { audio: result, mimetype: "audio/mpeg" }, { quoted: ctx.message });
      } catch (err) {
        await ctx.reply(`${mess.error}\n${err.message}`);
      }
    },
  };
}

module.exports = Object.entries(FILTERS).map(([name, filter]) =>
  audioEffectCommand(name, [], filter, name)
);
