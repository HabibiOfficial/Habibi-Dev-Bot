// lib/audioEffect.js
// Helper untuk menjalankan filter ffmpeg pada buffer audio dan mengembalikan buffer hasil.
// Membutuhkan binary ffmpeg terpasang di sistem (bukan hanya library node fluent-ffmpeg).

const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { randomInt } = require("./utils");

let ffmpeg;
try {
  // eslint-disable-next-line global-require
  ffmpeg = require("fluent-ffmpeg");
} catch {
  ffmpeg = null;
}

function isFfmpegAvailable() {
  return Boolean(ffmpeg);
}

/**
 * Terapkan filter audio ffmpeg ke buffer, kembalikan buffer hasil (mp3).
 * @param {Buffer} inputBuffer
 * @param {string} filter - audio filter ffmpeg, contoh: "asetrate=44100*1.25"
 */
function applyAudioFilter(inputBuffer, filter) {
  return new Promise((resolve, reject) => {
    if (!ffmpeg) return reject(new Error("ffmpeg tidak terpasang di sistem."));

    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `in-${randomInt(1000, 9999)}.mp3`);
    const outputPath = path.join(tmpDir, `out-${randomInt(1000, 9999)}.mp3`);

    fs.writeFileSync(inputPath, inputBuffer);

    ffmpeg(inputPath)
      .audioFilters(filter)
      .on("end", () => {
        const result = fs.readFileSync(outputPath);
        fs.removeSync(inputPath);
        fs.removeSync(outputPath);
        resolve(result);
      })
      .on("error", (err) => {
        fs.removeSync(inputPath);
        reject(err);
      })
      .save(outputPath);
  });
}

module.exports = { isFfmpegAvailable, applyAudioFilter };
