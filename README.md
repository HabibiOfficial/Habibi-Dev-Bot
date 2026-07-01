# Habibih Dev Bot

Bot WhatsApp berbasis [`habibih-bailys`](https://www.npmjs.com/package/habibih-bailys), dibuat untuk **Habibih Store**. Terinspirasi dari gaya menu bot seperti "Elaine The Primary", dengan struktur command yang mudah dikembangkan.

## ✨ Fitur

227+ command unik (314+ termasuk alias) terbagi dalam 16 kategori:

| Kategori | Jumlah | Keterangan |
|---|---|---|
| Main | 18 | menu, ping, owner, status keamanan, dll |
| Group | 48 | promote, kick, tagall, toggle antilink/welcome/dll |
| User (RPG) | 10 | profile, daily claim, exp, koin, leaderboard |
| Fun / Hiburan | 32 | ship, truth, dare, confess, khodam, dll |
| Game | 8 | tebakkata, susunkata, suit, caklontong |
| TTS | 8 | text to speech (Google TTS gratis + karakter via API) |
| Sticker | 16 | sticker/toimg real, attp/brat/removebg via API |
| Audio Effect | 16 | bass, slow, fast, robot, reverse, dll (via ffmpeg) |
| Religi | 8 | jadwal sholat (real API), asmaul husna, doa, kisah nabi |
| Cek | 24 | cek kepribadian (hiburan, hasil konsisten harian) |
| Download | 20 | TikTok real (tikwm), IG/FB/YT/dll via API |
| AI Image | 38 | text-to-image & image editing via API |
| Ephoto | 15 | efek teks ephoto360 via API |
| Canvas | 10 | wanted/wasted/jail/ektp via API |
| Stalker | 8 | GitHub real (API publik), IG/TikTok/FF via API |
| Search | 7 | brainly, wattpad, jadwal bola, dll via API |

Beberapa command **berjalan nyata tanpa API tambahan** (menu, ping, group management, RPG, fun, game, cek, TTS dasar, jadwal sholat, TikTok, GitHub stalk). Command lain yang butuh model AI/scraper pihak ketiga (AI Image, Ephoto, Canvas, sebagian Download/Sticker/TTS) memakai `lib/styleFactory.js` dan akan menampilkan pesan **"API belum diatur"** sampai kamu isi `config.api.baseUrl` & `config.api.key`.

## 🚀 Instalasi

```bash
npm install
```

## ⚙️ Konfigurasi

Edit `config.js` untuk mengatur:

- **Identitas bot**: `botName`, `storeName`, `ownerName`, `ownerNumber`
- **Prefix**: default `[".", "/", "#", "?", "!"]`
- **Metode login**: `loginMethod: "pairing"` atau `"qr"` (+ `pairingNumber`)
- **Auto-follow channel**: `enableAutoFollow` + `autoFollowChannels` (channel milik sendiri, dipanggil eksplisit & transparan)
- **API pihak ketiga**: `api.baseUrl` & `api.key` (opsional, untuk command AI Image/Ephoto/Canvas/dll)

## ▶️ Menjalankan

```bash
npm start
```

- Jika `loginMethod: "pairing"` → kode pairing 8 digit akan tampil di terminal, masukkan lewat WhatsApp > Perangkat Tertaut > Tautkan dengan nomor telepon.
- Jika `loginMethod: "qr"` → QR code akan tampil di terminal untuk di-scan.

## 📁 Struktur Proyek

```
config.js            # Semua konfigurasi bot
index.js             # Entry point, koneksi WhatsApp
lib/
  handler.js         # Router command + pengecekan permission otomatis
  permissions.js     # isOwner, isGroupAdmin, isBotAdmin, dll
  messages.js         # Pesan standar (owner/admin/group/dll)
  database.js        # Database JSON sederhana (group settings, user RPG)
  commandLoader.js   # Memuat semua command dari /commands
  styleFactory.js     # Generator command massal berbasis API
  groupEvents.js      # Notifikasi welcome/promote/demote
  gameSession.js / gameListener.js  # State game interaktif
  audioEffect.js       # Wrapper ffmpeg untuk efek audio
commands/
  main/ group/ user/ fun/ game/ tts/ sticker/ audio/
  religi/ cek/ download/ aiimage/ ephoto/ canvas/ stalker/ search/
data/                 # Dataset statis (doa, asmaul husna, soal game, dll)
```

## 🛠️ Menambah Command Baru

Buat file baru di kategori terkait, export object atau array:

```js
module.exports = {
  name: "contoh",
  aliases: ["cth"],
  category: "main",
  groupOnly: false,   // opsional: batasi hanya di grup
  adminOnly: false,    // opsional: hanya admin grup
  ownerOnly: false,    // opsional: hanya owner bot
  async execute(ctx) {
    await ctx.reply("Halo dari command baru!");
  },
};
```

`commandLoader.js` akan otomatis mendeteksi & mendaftarkan command ini saat bot start.

## ⚠️ Catatan

- Beberapa kategori (Cek, Search) diisi berdasarkan referensi menu yang sempat terpotong saat screenshot; command bisa disesuaikan/ditambah kapan saja.
- Fitur database masih berbasis file JSON (`database/`), cukup untuk skala kecil-menengah. Untuk skala besar, disarankan migrasi ke MongoDB/SQLite.
