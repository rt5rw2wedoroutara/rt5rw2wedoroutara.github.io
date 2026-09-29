import React, { useState } from 'react';
import { Github, Check, Copy, ExternalLink, X, Terminal, Globe, Shield } from 'lucide-react';

interface GitHubPagesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesGuideModal: React.FC<GitHubPagesGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Panduan Deployment ke GitHub Pages
            </h2>
            <p className="text-xs text-slate-500">
              Hosting gratis selamanya tanpa server & kontrol versi mudah untuk RT Anda.
            </p>
          </div>
        </div>

        {/* FAQ: Can GitHub Pages handle multiple tabs/pages? */}
        <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-950">
          <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Apakah GitHub Pages Bisa Banyak Halaman / Tab?</span>
          </div>
          <p className="leading-relaxed text-emerald-800">
            <strong>BISA & SANGAT COCOK!</strong> Meskipun GitHub Pages menyajikan berkas web statis, aplikasi ini dibangun menggunakan teknologi <em>Single Page Application (SPA)</em> dengan React. Semua navigasi antar tab (Pengumuman, Kas & Grafik Real-Time, Galeri Foto Fasilitas, Informasi Iuran, dan Cetak Laporan Kas) berpindah secara dinamis di peramban tanpa perlu memuat ulang halaman (reload) dan tanpa memerlukan server backend berbayar.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              <span>Konfigurasi Siap GitHub Pages Sudah Aktif</span>
            </div>
            <p className="text-slate-600 pl-8">
              Aplikasi ini sudah diprogram dengan konfigurasi path relatif (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono text-xs">base: './'</code> di <code className="font-mono text-xs">vite.config.ts</code>). Anda tidak perlu mengubah kode apapun saat di-host di <code className="font-mono text-xs">username.github.io/nama-repo/</code>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Buat Repositori di GitHub & Push Kode</span>
            </div>
            <p className="text-slate-600 pl-8">
              Jalankan perintah berikut di terminal komputer Anda untuk mengunggah ke GitHub:
            </p>
            <div className="ml-8 bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs relative overflow-x-auto">
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m "Inisialisasi Portal Warga RT Online"</div>
              <div>git branch -M main</div>
              <div>git remote add origin https://github.com/USERNAME/portal-rt.git</div>
              <div>git push -u origin main</div>
              <button
                type="button"
                onClick={() => handleCopy('git init && git add . && git commit -m "Inisialisasi Portal Warga RT" && git branch -M main && git push -u origin main', 1)}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                title="Salin Perintah"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Aktifkan GitHub Pages Otomatis (GitHub Actions)</span>
            </div>
            <p className="text-slate-600 pl-8">
              1. Buka Repositori GitHub Anda → Klik menu <strong>Settings</strong> → <strong>Pages</strong>.<br />
              2. Pada bagian <strong>Build and deployment</strong> → <strong>Source</strong>: pilih <strong>"GitHub Actions"</strong>.<br />
              3. Simpan berkas alur kerja di bawah ini ke dalam <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">.github/workflows/deploy.yml</code> di repositori Anda.
            </p>

            <div className="ml-8 bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] relative max-h-48 overflow-y-auto">
              <pre>{workflowYaml}</pre>
              <button
                type="button"
                onClick={() => handleCopy(workflowYaml, 2)}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1"
                title="Salin Workflow"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">Salin YAML</span>
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
              <span>Selesai & Bagikan Tautan ke Warga!</span>
            </div>
            <p className="text-slate-600 pl-8">
              Website RT Anda akan langsung aktif di alamat <code className="font-mono text-emerald-800 font-bold">https://USERNAME.github.io/portal-rt/</code>. Anda cukup membagikan tautan ini ke grup WhatsApp warga RT.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
