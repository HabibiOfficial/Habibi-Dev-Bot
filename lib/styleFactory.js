// lib/styleFactory.js
// Factory untuk membuat banyak command "sejenis" (efek teks, AI image, dll)
// tanpa menulis ulang boilerplate try/catch/API call di setiap file.
//
// Dipakai oleh kategori besar seperti AI IMAGE (38 cmd), EPHOTO (15 cmd),
// STICKER berbasis API, STALKER, CANVAS, dll — semuanya punya pola yang sama:
// "ambil teks/gambar dari user -> kirim ke endpoint API -> balas hasilnya".

const { callApi, isApiConfigured } = require("./api");
const mess = require("./messages");
const { getQuotedMessage } = require("./utils");

/**
 * Bikin satu command berbasis teks (contoh: efek teks ephoto360, .doa, dll)
 * @param {object} opts
 * @param {string} opts.name - nama command, contoh: "glitchtext"
 * @param {string[]} [opts.aliases]
 * @param {string} opts.category
 * @param {string} opts.endpoint - path endpoint API, contoh: "/ephoto/glitchtext"
 * @param {string} [opts.example] - contoh penggunaan, ditampilkan saat argumen kosong
 * @param {string} [opts.paramName] - nama query param yang dikirim ke API (default "text")
 * @param {(data: any) => object} [opts.formatResult] - transform hasil API jadi payload sendMessage
 */
function createTextCommand(opts) {
  const {
    name,
    aliases = [],
    category,
    endpoint,
    example = `${name} teks di sini`,
    paramName = "text",
    formatResult,
  } = opts;

  return {
    name,
    aliases,
    category,
    description: `Generate efek "${name}" dari teks yang diberikan.`,
    async execute(ctx) {
      if (!isApiConfigured()) return ctx.reply(mess.apiNotConfigured);
      if (!ctx.text) return ctx.reply(`⚠️ Contoh: *${ctx.usedPrefix}${example}*`);

      await ctx.reply(mess.wait);
      const data = await callApi(endpoint, { [paramName]: ctx.text });

      if (formatResult) return ctx.reply(formatResult(data));

      const resultUrl = data?.result || data?.url || data?.data;
      if (!resultUrl) return ctx.reply(mess.notFound);
      return ctx.reply({ image: { url: resultUrl }, caption: mess.done });
    },
  };
}

/**
 * Bikin satu command berbasis gambar (contoh: AI image editing, removebg, toghibli, dll)
 * Mengambil gambar dari quoted message atau media langsung di pesan yang sama.
 */
function createImageCommand(opts) {
  const { name, aliases = [], category, endpoint, example = `${name} (kirim/reply gambar)` } = opts;

  return {
    name,
    aliases,
    category,
    description: `Ubah gambar dengan efek "${name}".`,
    async execute(ctx) {
      if (!isApiConfigured()) return ctx.reply(mess.apiNotConfigured);

      const quoted = getQuotedMessage(ctx.message);
      const hasDirectImage = ctx.message.message?.imageMessage;
      if (!quoted?.imageMessage && !hasDirectImage) {
        return ctx.reply(`⚠️ Kirim atau reply gambar dengan caption *${ctx.usedPrefix}${example}*`);
      }

      await ctx.reply(mess.wait);
      // NOTE: pengambilan buffer gambar sebenarnya (download media) memerlukan
      // fungsi downloadMediaMessage dari library baileys, dipasang saat integrasi akhir.
      const data = await callApi(endpoint, {});
      const resultUrl = data?.result || data?.url || data?.data;
      if (!resultUrl) return ctx.reply(mess.notFound);
      return ctx.reply({ image: { url: resultUrl }, caption: mess.done });
    },
  };
}

/**
 * Bikin banyak command sekaligus dari daftar definisi ringkas.
 * Contoh pakai:
 *   buildTextCommandSet(category, [
 *     { name: "glitchtext", endpoint: "/ephoto/glitchtext" },
 *     { name: "neonglitch", endpoint: "/ephoto/neonglitch" },
 *   ])
 */
function buildTextCommandSet(category, definitions) {
  return definitions.map((def) => createTextCommand({ category, ...def }));
}

function buildImageCommandSet(category, definitions) {
  return definitions.map((def) => createImageCommand({ category, ...def }));
}

module.exports = {
  createTextCommand,
  createImageCommand,
  buildTextCommandSet,
  buildImageCommandSet,
};
