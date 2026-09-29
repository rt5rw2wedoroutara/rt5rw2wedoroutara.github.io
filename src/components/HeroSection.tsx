import React, { useState, useEffect, useCallback } from 'react';
import { RTConfig } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  TrendingUp, 
  BellRing, 
  Building2, 
  Wallet, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  Camera,
  Sparkles
} from 'lucide-react';

import gotongRoyongImg from '../assets/images/rt_gotong_royong_1790211376086.jpg';
import posyanduImg from '../assets/images/rt_posyandu_lansia_1790211394152.jpg';
import posKamlingImg from '../assets/images/rt_pos_kamling_1790211407357.jpg';
import balaiPertemuanImg from '../assets/images/rt_balai_pertemuan_1790211422682.jpg';
import communityBannerImg from '../assets/images/rt_community_banner_1790210310080.jpg';
import emblemLogoImg from '../assets/images/rt_emblem_logo_1790210325219.jpg';

interface HeroSectionProps {
  config: RTConfig;
  currentBalance: number;
  onNavigateTab: (tab: string) => void;
  isSeniorMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  currentBalance,
  onNavigateTab,
  isSeniorMode,
}) => {
  // Activity Slides Data
  const slides = [
    {
      id: 'gotong-royong',
      image: gotongRoyongImg,
      tag: 'Gotong Royong',
      title: 'Kerja Bakti Kebersihan Lingkungan',
      desc: 'Warga bersama membersihkan saluran air dan merawat keasrian jalan RT 05.',
    },
    {
      id: 'posyandu-lansia',
      image: posyanduImg,
      tag: 'Layanan Kesehatan',
      title: 'Posyandu Lansia & Balita Sehat',
      desc: 'Pemeriksaan tensi darah gratis, penimbangan, dan vitamin untuk bapak/ibu lansia.',
    },
    {
      id: 'pos-kamling',
      image: posKamlingImg,
      tag: 'Keamanan Lingkungan',
      title: 'Pos Keamanan & Portal 24 Jam',
      desc: 'Penjagaan ketat satu pintu (one-gate system) dan ronda malam demi ketenangan warga.',
    },
    {
      id: 'balai-pertemuan',
      image: balaiPertemuanImg,
      tag: 'Musyawarah Warga',
      title: 'Balai Pertemuan Silaturahmi RT',
      desc: 'Tempat musyawarah warga, pemaparan laporan kas terbuka, dan dialog mufakat.',
    },
    {
      id: 'lingkungan-asri',
      image: communityBannerImg,
      tag: 'Penghijauan',
      title: 'Lingkungan Asri & Bersih RT 05',
      desc: 'Penataan tanaman hijau dan pengelolaan sampah teratur menciptakan kenyamanan tinggal.',
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Next & Previous Handlers
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Dynamic Ambient Background Photography crossfades subtly with current slide */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25 scale-105 transition-all duration-1000 blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-10 sm:pb-14">
        
        {/* Top Split Layout: Welcome & Balance on Left, Interactive Photo Slideshow on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          
          {/* Left Column (col 12 -> lg:7): Text & Real-time Balance */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <img
                src={emblemLogoImg}
                alt="Lambang Rukun Tetangga"
                referrerPolicy="no-referrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-400/40 shadow-md shrink-0"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 tracking-wide uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Portal Resmi Lingkungan RT {config.rtNumber} / RW {config.rwNumber}
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className={`font-black tracking-tight text-white leading-tight ${
                isSeniorMode ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}>
                Transparansi Kas & Informasi Warga {config.neighbourhoodName}
              </h1>
              <p className={`mt-2.5 text-slate-300 leading-relaxed ${
                isSeniorMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}>
                Pusat informasi gotong royong, agenda kegiatan posyandu lansia, jadwal operasional kebersihan, dan pemantauan real-time saldo kas terbuka bagi seluruh warga.
              </p>
            </div>

            {/* Quick Balance Hero Stat Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Saldo Kas RT Terkini</span>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tabular-nums tracking-tight">
                  {formatRupiah(currentBalance)}
                </div>
                <div className="mt-1.5 text-xs text-slate-300 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Diperbarui otomatis setiap ada pemasukan/pengeluaran</span>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => onNavigateTab('keuangan')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  Buka Rincian Kas →
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (col 12 -> lg:5): Featured Interactive Photo Slideshow */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl">
              
              {/* Slideshow Header Title */}
              <div className="flex items-center justify-between px-1 pb-2.5 mb-2 border-b border-slate-700 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Slide Dokumentasi Kegiatan Warga</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono font-bold">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title={isPlaying ? 'Jeda pergantian otomatis foto' : 'Putar otomatis foto'}
                    aria-label={isPlaying ? 'Jeda slide foto' : 'Putar slide foto'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Slide Main Image Box */}
              <div className="relative rounded-xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-slate-950 group">
                <img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Slide Category Tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {currentSlide.tag}
                  </span>
                </div>

                {/* Left & Right Arrow Buttons (Accessible & High Contrast for Elderly) */}
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Caption on Bottom of Image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h2 className="font-bold text-sm sm:text-base leading-snug drop-shadow-md">
                    {currentSlide.title}
                  </h2>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 opacity-90 drop-shadow-xs">
                    {currentSlide.desc}
                  </p>
                </div>
              </div>

              {/* Dots / Thumbnail Indicators for Elderly Ease */}
              <div className="flex items-center justify-center gap-2 pt-3 pb-1">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`transition-all rounded-full ${
                      currentSlideIndex === idx
                        ? 'w-7 h-2 bg-emerald-400'
                        : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    title={slide.title}
                    aria-label={`Pilih foto ${idx + 1}: ${slide.title}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* 3 Interactive Navigation Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: Grafik Keuangan */}
          <button
            type="button"
            onClick={() => onNavigateTab('keuangan')}
            className="group text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-4 sm:p-5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Keuangan Kas</span>
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-white text-base sm:text-lg">
              Grafik & Buku Kas
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pantau pemasukan, belanja operasional pos satpam, dan alokasi dana warga.
            </p>
          </button>

          {/* Card 2: Pengumuman Warga */}
          <button
            type="button"
            onClick={() => onNavigateTab('pengumuman')}
            className="group text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-4 sm:p-5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Agenda Kegiatan</span>
              <BellRing className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-white text-base sm:text-lg">
              Pengumuman & Suara
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Informasi kerja bakti, posyandu lansia, dan fitur bantuan dengar suara.
            </p>
          </button>

          {/* Card 3: Fasilitas & Jadwal */}
          <button
            type="button"
            onClick={() => onNavigateTab('fasilitas')}
            className="group text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-4 sm:p-5 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Dokumentasi</span>
              <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-white text-base sm:text-lg">
              Fasilitas & Jadwal Layanan
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Foto pos keamanan 24 jam, balai pertemuan, dan jadwal angkut sampah.
            </p>
          </button>

        </div>

      </div>
    </section>
  );
};
