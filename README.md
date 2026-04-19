# Erzam Bayu — Personal Portfolio

Game Promoter & Web Developer asal Jakarta. Live di **[erzambayu.net](https://erzambayu.net/)** (via GitHub Pages + custom domain).

## Fitur

- Single-page vCard style, 4 tab: About / Resume / Portfolio / Contact
- Dua bahasa (ID / EN) dengan preferensi tersimpan di `localStorage`
- Light / dark theme toggle (respek `prefers-color-scheme`, no-flash bootstrap)
- Project modal dengan fokus trap & ESC-to-close
- Filter portfolio (All / Web Development / Applications / Browser Extension / E-Commerce)
- Form kontak via Formspree dengan submit AJAX + inline feedback
- SEO-ready: canonical, OpenGraph, Twitter Card, JSON-LD `Person`, sitemap, robots.txt
- Lazy-loaded images dengan `width`/`height` eksplisit untuk hindari CLS
- Responsif dari 320 px sampai desktop lebar

## Stack

Vanilla **HTML5 · CSS3 · JavaScript** — tanpa framework, tanpa build step. Icon pakai [Ionicons](https://ionic.io/ionicons), tech icons dari [devicon](https://devicon.dev/).

## Struktur

```
.
├── index.html            # Entry point (semua konten)
├── assets/
│   ├── css/style.css     # Single stylesheet
│   ├── js/script.js      # Interaktivitas (tab, modal, i18n, theme, form)
│   └── images/           # Avatar, OG image, icon SVG
├── Erzam_Bayu_CV_ATS_english.pdf
├── robots.txt
├── sitemap.xml
├── CNAME                 # Custom domain: erzambayu.net
└── .github/workflows/ci.yml
```

## Jalankan lokal

Tidak perlu bundler — cukup serve folder root dengan static server apa pun:

```bash
# Python (paling praktis)
python3 -m http.server 5173

# atau Node
npx serve . -l 5173
```

Buka `http://localhost:5173`.

## Deploy

Push ke branch `main` → GitHub Pages otomatis deploy (file `CNAME` mengarahkan ke `erzambayu.net`).

## CI

GitHub Action di `.github/workflows/ci.yml` menjalankan pada setiap push / PR:

- `html-validate` — cek markup valid
- `linkinator` — cek semua link internal tidak broken

## Kontak

- Email: [erzambayu@gmail.com](mailto:erzambayu@gmail.com)
- GitHub: [@erzambayu](https://github.com/erzambayu)
- LinkedIn: [erzam-bayu](https://linkedin.com/in/erzam-bayu)
- Instagram: [@erzam.bayu](https://instagram.com/erzam.bayu)

## Credits

Template dasar awalnya diadaptasi dari [vCard Personal Portfolio by @codewithsadee](https://github.com/codewithsadee/vcard-personal-portfolio), kemudian di-refactor signifikan (i18n, theme toggle, project modal, filter, SEO, a11y, performance).

## Lisensi

[MIT](LICENSE)
