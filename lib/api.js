// lib/api.js
// Wrapper kecil untuk memanggil API pihak ketiga (downloader, AI image, dll).
// Command yang butuh API pihak ketiga tinggal pakai helper ini,
// supaya kalau owner belum isi config.api, semua command terkait otomatis
// menampilkan pesan "API belum diatur" alih-alih error mentah.

const axios = require("axios");
const config = require("../config");
const mess = require("./messages");

function isApiConfigured() {
  return Boolean(config.api && config.api.baseUrl);
}

/**
 * Panggil endpoint API pihak ketiga yang sudah diatur di config.api.baseUrl.
 * @param {string} path - path endpoint, contoh: "/downloader/tiktok"
 * @param {object} params - query params
 */
async function callApi(path, params = {}) {
  if (!isApiConfigured()) {
    throw new Error(mess.apiNotConfigured);
  }
  const url = `${config.api.baseUrl}${path}`;
  const { data } = await axios.get(url, {
    params: { ...params, apikey: config.api.key },
    timeout: 30000,
  });
  return data;
}

/** Download buffer dari sebuah URL langsung (tanpa lewat API pihak ketiga) */
async function fetchBuffer(url) {
  const { data } = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(data);
}

module.exports = { isApiConfigured, callApi, fetchBuffer };
