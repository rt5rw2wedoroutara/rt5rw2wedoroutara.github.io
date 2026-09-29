import React from 'react';
import { RTConfig } from '../types';
import { 
  Menu, 
  X,
  FileText
} from 'lucide-react';

interface NavbarProps {
  config: RTConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSeniorMode: boolean;
  setIsSeniorMode: (mode: boolean | ((prev: boolean) => boolean)) => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  activeTab,
  setActiveTab,
  isSeniorMode,
  setIsSeniorMode,
  onOpenReportModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'pengumuman', label: 'Pengumuman' },
    { id: 'keuangan', label: 'Kas & Grafik' },
    { id: 'fasilitas', label: 'Fasilitas & Jadwal' },
    { id: 'iuran', label: 'Informasi Iuran' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    // Smoothly scroll down to the content tabs section
    setTimeout(() => {
      const section = document.getElementById('tab-content-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-2xs shrink-0 tracking-tight">
              RT{config.rtNumber}
            </div>
            <div>
              <span className="block text-base sm:text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
                Portal RT {config.rtNumber} {config.neighbourhoodName}
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                RW {config.rwNumber}, Kel. {config.villageName}, Kec. {config.districtName}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Senior Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSeniorMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                isSeniorMode
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Perbesar ukuran tulisan untuk warga lanjut usia"
            >
              <span className="text-sm font-black">A+</span>
              <span className="hidden sm:inline">
                {isSeniorMode ? 'Teks Besar: Aktif' : 'Teks Besar'}
              </span>
            </button>

            {/* Print Financial Statement Button */}
            <button
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
              title="Cetak Laporan Pertanggungjawaban Kas RT"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Kas</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenReportModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Cetak Laporan Kas Bulanan</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
