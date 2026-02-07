# 💰 DompetKu

Aplikasi expense tracker pribadi yang simpel dan mudah digunakan. Dibuat pake Next.js + TypeScript + Tailwind CSS.

## Kenapa Bikin Ini?

Gue butuh aplikasi buat tracking pengeluaran sehari-hari yang gak ribet. Kebanyakan app di luar sana terlalu kompleks atau butuh subscription. Jadi ya udah, bikin sendiri aja yang sesuai kebutuhan.

## Fitur

-  **Catat Transaksi** - Input pemasukan & pengeluaran dengan kategori
-  **Dashboard** - Lihat ringkasan keuangan dengan grafik
-  **Budget** - Set anggaran per kategori biar gak overspending
-  **Subscriptions** - Track langganan (Netflix, Spotify, dll)
-  **Goals** - Target tabungan dengan progress bar
-  **Dark Mode** - Bisa ganti tema sesuai mood
-  **Responsive** - Bisa dibuka di HP atau desktop

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: localStorage (data disimpan di browser)

## Cara Pakai

### Development

```bash
# Clone repo
git clone https://github.com/FaaWeell/dompetku.git

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka http://localhost:3000
```

### Production

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

## Deploy ke Vercel

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import project dari GitHub
4. Deploy - selesai!

## Struktur Folder

```
src/
├── app/                 # Next.js pages
│   ├── dashboard/       # Dashboard pages
│   ├── login/          # Login page
│   └── page.tsx        # Landing page
├── components/         # React components
│   ├── charts/         # Chart components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── context/            # React Context (auth, theme)
├── hooks/              # Custom hooks
└── lib/                # Utilities & types
```

## Notes

- Data disimpan di localStorage browser, jadi kalau clear browser data, data hilang
- Ini project personal, jadi ada hardcoded credentials (jangan dipake buat production serious ya)

## License

MIT - bebas dipake, dimodif, di-fork

---

Made with ☕ by Fajri
