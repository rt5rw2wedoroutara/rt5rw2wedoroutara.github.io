import React from 'react';
import { RTConfig } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  ShieldCheck, 
  Trash2, 
  Lightbulb, 
  HeartHandshake, 
  CheckCircle2, 
  HelpCircle,
  Building,
  CreditCard
} from 'lucide-react';

interface DuesInfoModuleProps {
  config: RTConfig;
  isSeniorMode: boolean;
  onNavigateToKas: () => void;
}

export const DuesInfoModule: React.FC<DuesInfoModuleProps> = ({
  config,
  isSeniorMode,
  onNavigateToKas,
}) => {
  const allocations = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
      title: 'Honor Petugas Keamanan & Pos Satpam 24 Jam',
      amount: 25000,
      description: 'Penjagaan gerbang utama satu pintu (one-gate system), ronda keliling malam, dan pemantauan lingkungan.',
    },
    {
      icon: <Trash2 className="w-5 h-5 text-emerald-700" />,
      title: 'Retribusi Pengangkutan Sampah Lingkungan',
      amount: 15000,
      description: 'Pengambilan sampah harian 3 kali seminggu (Senin, Rabu, Sabtu) langsung dari depan pagar rumah warga ke TPS.',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-700" />,
      title: 'Penerangan Jalan Umum (PJU) & Listrik Pos',
      amount: 5000,
      description: 'Tagihan daya listrik lampu penerangan gang jalan dan pengadaan bohlam lampu LED tahan cuaca.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-rose-700" />,
      title: 'Dana Kas Sosial, Kerja Bakti & Duka Cita',
      amount: 5000,
      description: 'Santunan duka cita keluarga yang tertimpa musibah, konsumsi kerja bakti warga, dan perawatan alat kebersihan.',
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className={`font-bold tracking-tight text-slate-900 ${isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
          Informasi & Alokasi Iuran Kas Warga RT {config.rtNumber}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Penjelasan resmi besaran iuran, transparansi peruntukan dana, serta tata cara penyetoran kas lingkungan.
        </p>
      </div>

      {/* Main Dues Card */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-emerald-200 border border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Keputusan Musyawarah Warga Resmi
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {formatRupiah(config.monthlyDuesAmount)} <span className="text-base font-normal text-emerald-200">/ Kepala Keluarga / Bulan</span>
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Iuran wajib bulanan dikelola secara terbuka dan dapat dipantau perkembangannya kapan saja secara langsung melalui grafik keuangan di website ini.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onNavigateToKas}
              className="px-5 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-sm font-bold shadow-xs transition-colors"
            >
              Lihat Grafik Kas Real-Time →
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown per KK */}
      <div className="space-y-4">
        <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
          Rincian Transparan Peruntukan Iuran Rp 50.000
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Setiap rupiah yang disetorkan warga dialokasikan langsung untuk operasional vital kenyamanan bersama:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allocations.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {item.icon}
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {formatRupiah(item.amount)}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods & FAQ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-700" />
          <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            Tata Cara Penyetoran Iuran
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Penyetoran Langsung saat Pertemuan Warga</span>
            </div>
            <p className="text-slate-600 pl-7 leading-relaxed">
              Warga dapat menyetorkan iuran secara tunai langsung pada pertemuan rutin warga bulanan di Balai Pertemuan RT 05 dan akan langsung dicatatkan ke dalam kas.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Penyetoran Lewat Petugas Bendahara Lingkungan</span>
            </div>
            <p className="text-slate-600 pl-7 leading-relaxed">
              Penyetoran juga dapat dititipkan pada jam pelayanan pengurus di sekretariat lingkungan atau saat petugas penarik iuran lingkungan berkunjung.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Privasi & Keamanan Data Warga:</span> Sesuai kesepakatan bersama, demi menjaga kenyamanan privasi keluarga, nama dan nomor rumah warga tidak dipublikasikan secara terbuka di internet. Laporan keuangan disajikan dalam bentuk rekapitulasi kas menyeluruh yang transparan dan dapat diaudit bersama.
          </div>
        </div>
      </div>

    </div>
  );
};
