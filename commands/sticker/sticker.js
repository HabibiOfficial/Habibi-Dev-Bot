// commands/sticker/sticker.js
// .sticker/.toimg dibuat real memakai sharp (konversi gambar <-> webp).
// removebg/nobg/attp/ttp/brat/dll butuh API pihak ketiga (dibuat lewat styleFactory).

const mess = require("../../lib/messages");
const { getQuotedMessage } = require("../../lib/utils");
const { buildTextCommandSet, buildImageCommandSet } = require("../../lib/styleFactory");

let sharp;
try {
  // eslint-disable-next-line global-require
  sharp = require("sharp");
} catch {
  sharp = null;
}

const stickerCommand = {
  name: "sticker",
  aliases: ["s"],
  category: "sticker",
  description: "Ubah gambar/video jadi stiker WhatsApp.",
  async execute(ctx) {
    const quoted = getQuotedMessage(ctx.message);
    const hasDirectMedia = ctx.message.message?.imageMessage || ctx.message.message?.videoMessage;
    if (!quoted?.imageMessage && !quoted?.videoMessage && !hasDirectMedia) {
      return ctx.reply(`⚠️ Kirim atau reply gambar/video dengan caption ${ctx.usedPrefix}sticker`);
    }
    if (!sharp) {
      return ctx.reply("⚙️ Library `sharp` belum terpasang. Jalankan `npm install sharp` untuk mengaktifkan fitur ini.");
    }

    try {
      const { downloadMediaMessage } = require("baileys");
      const targetMsg = quoted
        ? { message: quoted, key: ctx.message.message.extendedTextMessage.contextInfo }
        : ctx.message;
      const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
      const webp = await sharp(buffer).resize(512, 512, { fit: "inside" }).webp().toBuffer();
      await ctx.sock.sendMessage(ctx.from, { sticker: webp }, { quoted: ctx.message });
    } catch (err) {
      await ctx.reply(`${mess.error}\n${err.message}`);
    }
  },
};

const toImgCommand = {
  name: "toimg",
  category: "sticker",
  description: "Ubah stiker jadi gambar biasa.",
  async execute(ctx) {
    const quoted = getQuotedMessage(ctx.message);
    if (!quoted?.stickerMessage) return ctx.reply(`⚠️ Reply stiker dengan caption ${ctx.usedPrefix}toimg`);
    if (!sharp) {
      return ctx.reply("⚙️ Library `sharp` belum terpasang. Jalankan `npm install sharp` untuk mengaktifkan fitur ini.");
    }

    try {
      const { downloadMediaMessage } = require("baileys");
      const targetMsg = { message: quoted, key: ctx.message.message.extendedTextMessage.contextInfo };
      const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
      const png = await sharp(buffer).png().toBuffer();
      await ctx.sock.sendMessage(ctx.from, { image: png }, { quoted: ctx.message });
    } catch (err) {
      await ctx.reply(`${mess.error}\n${err.message}`);
    }
  },
};

// Sticker teks/gambar via API pihak ketiga
const textBasedStickers = buildTextCommandSet("sticker", [
  { name: "attp", endpoint: "/maker/attp", example: "attp Teks Bergerak" },
  { name: "ttp", endpoint: "/maker/ttp", example: "ttp Teks Statis" },
  { name: "brat", endpoint: "/maker/brat", example: "brat teks disini" },
  { name: "bratvid", endpoint: "/maker/bratvid", example: "bratvid teks disini" },
  { name: "bratvideo", endpoint: "/maker/bratvideo", example: "bratvideo teks disini" },
  { name: "furbrat", endpoint: "/maker/furbrat", example: "furbrat teks disini" },
  { name: "colongsw", endpoint: "/maker/colongsw", example: "colongsw @status" },
]);

const imageBasedStickers = buildImageCommandSet("sticker", [
  { name: "removebg", endpoint: "/tools/removebg" },
  { name: "nobg", endpoint: "/tools/removebg" },
]);

module.exports = [stickerCommand, toImgCommand, ...textBasedStickers, ...imageBasedStickers];
