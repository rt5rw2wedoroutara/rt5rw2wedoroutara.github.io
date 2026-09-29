import React from 'react';
import { FacilityItem, RTConfig } from '../types';
import { initialFacilities } from '../data/initialData';
import { 
  Building2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  HeartHandshake, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface FacilitiesModuleProps {
  config: RTConfig;
  isSeniorMode: boolean;
}

export const FacilitiesModule: React.FC<FacilitiesModuleProps> = ({
  config,
  isSeniorMode,
}) => {
  const facilities = initialFacilities;

  const schedules = [
    {
      icon: <Truck className="w-5 h-5 text-emerald-700" />,
      title: 'Jadwal Pengangkutan Sampah Warga',
      time: 'Senin, Rabu, & Sabtu (Pukul 07.00 - 10.00 WIB)',
      note: 'Diharapkan tempat sampah warga diletakkan di depan pagar rumah sebelum pukul 07.00 pagi.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
      title: 'Buka - Tutup Portal Masuk Lingkungan',
      time: 'Setiap Hari (Pukul 22.00 - 05.00 WIB)',
      note: 'Portal gerbang samping ditutup pada malam hari. Akses masuk melalui gerbang utama Pos Satpam 24 Jam.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-rose-700" />,
      title: 'Pelayanan Posyandu Balita & Lansia',
      time: 'Minggu Pertama Awal Bulan (Pukul 08.30 - 11.30 WIB)',
      note: 'Pemeriksaan tensi darah, penimbangan, dan vitamin berkala gratis di Balai Pertemuan Warga.',
    },
    {
      icon: <Calendar className="w-5 h-5 text-amber-700" />,
      title: 'Agenda Kerja Bakti Lingkungan',
      time: 'Minggu Ke-4 Setiap 2 Bulan (Pukul 06.30 WIB)',
      note: 'Gotong royong membersihkan selokan air dan perapian dahan pohon demi kenyamanan bersama.',
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Title & Introduction */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className={`font-bold tracking-tight text-slate-900 ${isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
          Fasilitas & Jadwal Layanan Lingkungan RT {config.rtNumber}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Dokumentasi fasilitas bersama, balai pertemuan warga, pos keamanan terpadu, dan jadwal operasional lingkungan.
        </p>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Facility Image with subtle zoom on hover */}
            <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
              <img
                src={fac.imageUrl}
                alt={fac.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {fac.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className={`font-black text-white drop-shadow-sm ${isSeniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                  {fac.title}
                </h3>
              </div>
            </div>

            {/* Facility Description */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className={`text-slate-600 leading-relaxed ${isSeniorMode ? 'text-base' : 'text-sm'}`}>
                {fac.description}
              </p>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-700">{fac.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">{fac.operationalHours}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routine Schedules & Service Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg mb-2">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Informasi Publik Pelayanan Lingkungan</span>
          </div>
          <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
            Jadwal Rutin Layanan Kebersihan, Keamanan & Kesehatan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Panduan jam operasional resmi untuk seluruh warga demi terciptanya lingkungan yang tertib, bersih, dan nyaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-100/70 transition-colors"
            >
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shrink-0 shadow-2xs">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {item.title}
                </h4>
                <div className="text-xs font-semibold text-emerald-800">
                  {item.time}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
