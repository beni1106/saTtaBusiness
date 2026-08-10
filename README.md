# Sattafa Business Partner — Website

Website korporat 4 halaman (Home, About, Services, Contact), dwibahasa ID/EN.

## Tech Stack

- **Vite** — dev server + bundler (live-reload otomatis)
- **Tailwind CSS v4** — via plugin resmi `@tailwindcss/vite`
- **Lucide** — icon, di-install lewat npm (bukan CDN, versi ter-pin)
- **Vanilla JS** — tanpa framework, termasuk animasi scroll pakai `IntersectionObserver` bawaan browser (bukan AOS)

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Setiap perubahan file akan otomatis reload di browser.

## Build untuk Production

```bash
npm run build
```

Hasil build ada di folder `dist/`. Untuk preview hasil build:

```bash
npm run preview
```

## Struktur Folder

```
├── index.html          Halaman Home
├── about.html           Halaman About Us
├── services.html         Halaman Services
├── contact.html          Halaman Contact
├── src/
│   ├── main.js          Logic: navbar, mobile menu, reveal animation, lang switch, accordion
│   ├── style.css        Design tokens (warna, font, radius) via Tailwind v4 @theme
│   ├── i18n.js           Kamus terjemahan ID/EN
│   └── partials/
│       ├── nav.html      Navbar (di-include ke semua halaman)
│       ├── footer.html   Footer (di-include ke semua halaman)
│       └── seal.html     Elemen grafis signature (seal akreditasi)
└── vite.config.js       Config Vite + plugin custom buat include partial HTML
```

Navbar dan footer tidak di-copy manual ke tiap halaman — dipecah jadi partial di
`src/partials/` dan di-include otomatis lewat plugin kecil di `vite.config.js`
(tandai lokasi include-nya pakai komentar `<!--@include(nama-file)-->`).

## Yang Masih Perlu Diisi Manual

- **Nomor telepon, alamat, dan koordinat Google Maps** di `contact.html` &
  `src/partials/footer.html` masih placeholder — ganti dengan data asli perusahaan.
- **Form kontak** masih statis (belum terhubung ke email atau backend apa pun).
- **Gambar hero**: desain saat ini pakai elemen grafis SVG orisinal (bukan foto
  stok) sebagai pengganti "professional business image" di brief, supaya
  terhindar dari kesan generic/AI. Kalau ada foto asli tim/kantor, bisa
  ditambahkan menggantikan elemen SVG tersebut di `index.html`.
