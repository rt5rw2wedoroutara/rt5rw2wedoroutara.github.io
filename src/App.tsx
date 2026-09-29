/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Announcement, 
  CashTransaction, 
  RTConfig 
} from './types';
import { 
  loadStoredData, 
  saveStoredData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FinanceModule } from './components/FinanceModule';
import { FacilitiesModule } from './components/FacilitiesModule';
import { DuesInfoModule } from './components/DuesInfoModule';
import { AnnouncementsModule } from './components/AnnouncementsModule';
import { FinancialReportModal } from './components/FinancialReportModal';
import { GitHubPagesGuideModal } from './components/GitHubPagesGuideModal';
import { 
  BellRing, 
  TrendingUp, 
  Building2, 
  Coins, 
  Github, 
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const initial = useMemo(() => loadStoredData(), []);

  const [config, setConfig] = useState<RTConfig>(initial.config);
  const [transactions, setTransactions] = useState<CashTransaction[]>(initial.transactions);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial.announcements);
  const [baseBalance, setBaseBalance] = useState<number>(initial.baseBalance);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>('pengumuman');
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(initial.isSeniorMode);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState(false);

  // Auto-persist changes to localStorage
  useEffect(() => {
    saveStoredData({
      config,
      transactions,
      announcements,
      baseBalance,
      isSeniorMode,
    });
  }, [config, transactions, announcements, baseBalance, isSeniorMode]);

  // Compute Current Real-Time Balance
  const currentBalance = useMemo(() => {
    const inc = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return baseBalance + inc - exp;
  }, [transactions, baseBalance]);

  // Smooth scroll down to tab content section
  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setTimeout(() => {
      const section = document.getElementById('tab-content-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Handler: Add transaction (kept for internal storage functionality)
  const handleAddTransaction = (newTx: Omit<CashTransaction, 'id'>) => {
    const txWithId: CashTransaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setTransactions((prev) => [txWithId, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Handler: Announcements
  const handleAddAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleTogglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${
      isSeniorMode ? 'text-lg leading-relaxed' : 'text-base'
    }`}>
      
      {/* Top Sticky Navbar without Admin Button */}
      <Navbar
        config={config}
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        isSeniorMode={isSeniorMode}
        setIsSeniorMode={setIsSeniorMode}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Hero Header Section with Slideshow */}
      <HeroSection
        config={config}
        currentBalance={currentBalance}
        onNavigateTab={handleSelectTab}
        isSeniorMode={isSeniorMode}
      />

      {/* Target Scroll Anchor & Tab Navigation Ribbon */}
      <div 
        id="tab-content-section" 
        className="bg-white border-b border-slate-200 shadow-2xs scroll-mt-16 sm:scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            
            <button
              type="button"
              onClick={() => handleSelectTab('pengumuman')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'pengumuman'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>Pengumuman & Agenda</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('keuangan')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'keuangan'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Kas & Grafik Real-Time</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('fasilitas')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'fasilitas'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Fasilitas & Jadwal Layanan</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('iuran')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'iuran'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Informasi Iuran Resmi</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'pengumuman' && (
          <AnnouncementsModule
            announcements={announcements}
            config={config}
            isAdmin={false}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onTogglePin={handleTogglePinAnnouncement}
            isSeniorMode={isSeniorMode}
          />
        )}

        {activeTab === 'keuangan' && (
          <FinanceModule
            transactions={transactions}
            baseBalance={baseBalance}
            config={config}
            isAdmin={false}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            isSeniorMode={isSeniorMode}
          />
        )}

        {activeTab === 'fasilitas' && (
          <FacilitiesModule
            config={config}
            isSeniorMode={isSeniorMode}
          />
        )}

        {activeTab === 'iuran' && (
          <DuesInfoModule
            config={config}
            isSeniorMode={isSeniorMode}
            onNavigateToKas={() => handleSelectTab('keuangan')}
          />
        )}
      </main>

      {/* Clean, Privacy-Safe Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs sm:text-sm">
            
            {/* Col 1: Identity */}
            <div className="space-y-2">
              <div className="font-bold text-white text-base">
                Rukun Tetangga {config.rtNumber} / RW {config.rwNumber}
              </div>
              <p className="text-slate-400 leading-relaxed">
                Lingkungan {config.neighbourhoodName}, Kelurahan {config.villageName}, Kecamatan {config.districtName}, {config.city}.
              </p>
              <p className="text-emerald-400 font-medium pt-1">
                "Rukun, Guyub, Aman, Bersih, dan Transparan"
              </p>
            </div>

            {/* Col 2: Public Service Locations */}
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">
                Lokasi Pelayanan & Pos Lingkungan
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pos Keamanan 24 Jam (Gerbang Utama RT 05)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Balai Pertemuan Warga & Pos Pelayanan Lansia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jadwal Angkut Sampah: Senin, Rabu & Sabtu Pagi</span>
                </li>
              </ul>
            </div>

            {/* Col 3: GitHub Hosting & System */}
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">
                Hosting & Kontrol Versi
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Portal statis mandiri di-deploy pada GitHub Pages. Mendukung multi-tab secara dinamis (SPA) tanpa perlu server backend berbayar.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsGithubGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                >
                  <Github className="w-4 h-4" />
                  <span>Panduan GitHub Pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Cetak Kas</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              © {new Date().getFullYear()} Lingkungan RT {config.rtNumber} / RW {config.rwNumber} {config.neighbourhoodName}. Semua hak dilindungi.
            </div>
            <div>
              Portal Warga Lingkungan Digital Mandiri · Transparan & Terlindungi
            </div>
          </div>
        </div>
      </footer>

      {/* Printable Monthly Financial Statement Modal */}
      <FinancialReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        transactions={transactions}
        baseBalance={baseBalance}
        config={config}
      />

      {/* GitHub Pages Deployment Guide Modal */}
      <GitHubPagesGuideModal
        isOpen={isGithubGuideOpen}
        onClose={() => setIsGithubGuideOpen(false)}
      />

    </div>
  );
}
