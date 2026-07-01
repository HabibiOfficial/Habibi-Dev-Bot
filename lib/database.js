// lib/database.js
// Database sederhana berbasis file JSON. Cukup untuk bot skala kecil-menengah.
// Untuk skala besar, ganti dengan MongoDB/SQLite sesuai kebutuhan.

const fs = require("fs-extra");
const path = require("path");

const DB_DIR = path.join(__dirname, "..", "database");
const GROUPS_FILE = path.join(DB_DIR, "groups.json");

fs.ensureDirSync(DB_DIR);
if (!fs.existsSync(GROUPS_FILE)) fs.writeJsonSync(GROUPS_FILE, {});

function readGroups() {
  return fs.readJsonSync(GROUPS_FILE, { throws: false }) || {};
}

function writeGroups(data) {
  fs.writeJsonSync(GROUPS_FILE, data, { spaces: 2 });
}

// Setting default untuk grup baru, sesuai panel "Group Management" di menu
const DEFAULT_GROUP_SETTINGS = {
  antiLink: false,
  antiToxic: false,
  antiSpam: false,
  welcome: false,
  antiRaid: false,
  slowMode: false,
  verifikasi: false,
  lockProfil: false,
  antiNSFW: false,
  ocrAntiLink: false,
  ocrAntiToxic: false,
};

function getGroupSettings(groupId) {
  const groups = readGroups();
  if (!groups[groupId]) {
    groups[groupId] = { ...DEFAULT_GROUP_SETTINGS };
    writeGroups(groups);
  }
  return groups[groupId];
}

function setGroupSetting(groupId, key, value) {
  const groups = readGroups();
  if (!groups[groupId]) groups[groupId] = { ...DEFAULT_GROUP_SETTINGS };
  groups[groupId][key] = value;
  writeGroups(groups);
  return groups[groupId];
}

// ====== USER (RPG: profile, exp, koin, daily claim) ======

const USERS_FILE = path.join(DB_DIR, "users.json");
if (!fs.existsSync(USERS_FILE)) fs.writeJsonSync(USERS_FILE, {});

const DEFAULT_USER = {
  exp: 0,
  level: 1,
  koin: 0,
  lastClaim: 0,
};

function readUsers() {
  return fs.readJsonSync(USERS_FILE, { throws: false }) || {};
}

function writeUsers(data) {
  fs.writeJsonSync(USERS_FILE, data, { spaces: 2 });
}

function getUser(userId) {
  const users = readUsers();
  if (!users[userId]) {
    users[userId] = { ...DEFAULT_USER };
    writeUsers(users);
  }
  return users[userId];
}

function updateUser(userId, patch) {
  const users = readUsers();
  if (!users[userId]) users[userId] = { ...DEFAULT_USER };
  users[userId] = { ...users[userId], ...patch };
  writeUsers(users);
  return users[userId];
}

/** Level dihitung dari total exp: level = floor(exp / 100) + 1 */
function calculateLevel(exp) {
  return Math.floor(exp / 100) + 1;
}

function getLeaderboard(limit = 10, sortBy = "exp") {
  const users = readUsers();
  return Object.entries(users)
    .sort((a, b) => b[1][sortBy] - a[1][sortBy])
    .slice(0, limit)
    .map(([userId, data]) => ({ userId, ...data }));
}

module.exports = {
  DEFAULT_GROUP_SETTINGS,
  getGroupSettings,
  setGroupSetting,
  DEFAULT_USER,
  getUser,
  updateUser,
  calculateLevel,
  getLeaderboard,
};
