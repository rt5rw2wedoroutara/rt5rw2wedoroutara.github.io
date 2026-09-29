# Portal RT Online (Rukun Tetangga)

Website portal informasi publik, transparansi keuangan kas, pengumuman warga, serta galeri fasilitas lingkungan. Didesain ramah lansia, terlindungi privasi, responsif di ponsel cerdas, dan siap di-deploy langsung ke **GitHub Pages**.

## ❓ Apakah GitHub Pages Bisa Menggunakan Website Ini?
**Tentu saja BISA!** 
Meskipun GitHub Pages secara teknis hanya menyajikan satu berkas `index.html` statis, website ini dibangun menggunakan teknologi modern **Single-Page Application (SPA) dengan React & Vite**. 

Semua navigasi tab (Pengumuman & Agenda, Kas & Grafik Real-Time, Galeri Fasilitas & Jadwal, Informasi Iuran, dan Cetak Laporan Kas) berpindah seketika di peramban tanpa me-reload halaman dan tanpa butuh server backend berbayar. Website ini 100% kompatibel dan gratis di-host di GitHub Pages selamanya!

## 🌟 Fitur Utama
1. **Transparansi Kas & Grafik Keuangan Real-Time**
   - Perhitungan otomatis saldo kas terkini secara transparan.
   - Grafik interaktif tren pemasukan vs pengeluaran per bulan.
   - Analisis alokasi belanja operasional (pos satpam, angkut sampah, penerangan jalan umum, perbaikan fasilitas, santunan duka cita).
   - Format cetak resmi Laporan Pertanggungjawaban Kas Bulanan bertanda tangan Ketua RT & Bendahara.
2. **Perlindungan Privasi Warga (Privacy-Protected)**
   - Tidak ada data sensitif yang dipublikasikan (bebas dari nama-nama pribadi warga, nomor telepon pribadi, alamat rumah privat, dan status pelunasan perorangan).
   - Laporan keuangan disajikan dalam bentuk rekapitulasi kas operasional lingkungan yang transparan.
3. **Dokumentasi Foto & Galeri Fasilitas Lingkungan**
   - Foto pos keamanan & portal 24 jam.
   - Balai pertemuan warga & pos pelayanan lansia.
   - Kegiatan gotong royong kerja bakti dan kebersihan.
   - Panduan jadwal rutin layanan (jadwal angkut sampah harian, buka-tutup portal, posyandu lansia).
4. **Pengumuman & Bantuan Suara (Audio Reader untuk Lansia)**
   - Warga lansia yang mengalami kesulitan membaca tulisan kecil dapat menekan tombol **"Dengarkan Suara (Audio)"** untuk mendengarkan pengumuman dibacakan nyaring berbahasa Indonesia.
   - Tombol cepat untuk meneruskan pengumuman ke grup WhatsApp warga.
5. **Mode Huruf Besar (Senior-Friendly)**
   - Sakelar khusus di navigasi atas untuk memperbesar ukuran font secara instan bagi kenyamanan warga senior.
6. **Mode Pengurus Ber-PIN & Backup Data JSON**
   - Warga umum dapat melihat seluruh transparansi informasi tanpa login.
   - Pengurus menggunakan PIN (default: `1234`) untuk mencatat transaksi kas dan menerbitkan pengumuman.
   - Fitur cadangkan dan pulihkan data kas melalui berkas JSON untuk disimpan langsung di repositori GitHub atau komputer pengurus.

## 🚀 Cara Menghosting di GitHub Pages
1. Unggah kode ke repositori GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi Portal Warga RT"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
2. Di repositori GitHub, buka **Settings** → **Pages** → **Build and deployment**:
   - Pilih Source: **GitHub Actions**.
3. Alur kerja di `.github/workflows/deploy.yml` akan secara otomatis membangun dan menerbitkan website ke:
   `https://USERNAME.github.io/NAMA-REPO/`

## 🛠️ Pengembangan Lokal
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.
