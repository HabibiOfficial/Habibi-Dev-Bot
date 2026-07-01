// lib/commandLoader.js
// Membaca semua file command dari folder /commands (rekursif per kategori)
// dan menggabungkannya jadi satu Map yang mudah dicari lewat nama/alias.
//
// Satu file command bisa export:
//   - Satu object command: { name, execute, ... }
//   - Array berisi banyak object command: [{ name, execute }, { name, execute }, ...]
// Ini dipakai supaya kategori besar (grup, sticker, dll) bisa ditulis dalam
// beberapa file saja tanpa kehilangan struktur "1 command = 1 nama".

const fs = require("fs");
const path = require("path");

const COMMANDS_DIR = path.join(__dirname, "..", "commands");

function registerCommand(commands, cmd, category) {
  if (!cmd || !cmd.name || typeof cmd.execute !== "function") return;

  cmd.category = cmd.category || category;
  commands.set(cmd.name.toLowerCase(), cmd);

  if (Array.isArray(cmd.aliases)) {
    for (const alias of cmd.aliases) {
      commands.set(alias.toLowerCase(), cmd);
    }
  }
}

function loadCommands() {
  const commands = new Map();
  const categories = fs
    .readdirSync(COMMANDS_DIR)
    .filter((f) => fs.statSync(path.join(COMMANDS_DIR, f)).isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(COMMANDS_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const exported = require(filePath);

        if (Array.isArray(exported)) {
          for (const cmd of exported) registerCommand(commands, cmd, category);
        } else {
          registerCommand(commands, exported, category);
        }
      } catch (err) {
        console.error(`[commandLoader] Gagal load command ${file}:`, err.message);
      }
    }
  }

  return commands;
}

/** Ambil daftar command unik (tanpa duplikat alias), dikelompokkan per kategori. */
function groupByCategory(commands) {
  const seen = new Set();
  const grouped = {};

  for (const cmd of commands.values()) {
    if (seen.has(cmd.name)) continue;
    seen.add(cmd.name);
    if (!grouped[cmd.category]) grouped[cmd.category] = [];
    grouped[cmd.category].push(cmd);
  }

  return grouped;
}

module.exports = { loadCommands, groupByCategory, COMMANDS_DIR };
