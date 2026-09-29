import React, { useState } from 'react';
import { Announcement, RTConfig } from '../types';
import { createWhatsAppUrl, formatDateIndo, playSpeechIndo, stopSpeech } from '../utils/formatters';
import { 
  BellRing, 
  Volume2, 
  VolumeX, 
  Share2, 
  Plus, 
  Pin, 
  Calendar, 
  MapPin, 
  User, 
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  config: RTConfig;
  isAdmin: boolean;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePin: (id: string) => void;
  isSeniorMode: boolean;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcements,
  config,
  isAdmin,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onTogglePin,
  isSeniorMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Announcement['category']>('Agenda Warga');
  const [formLocation, setFormLocation] = useState('');
  const [formPriority, setFormPriority] = useState<Announcement['priority']>('normal');
  const [formAuthor, setFormAuthor] = useState('Pengurus RT ' + config.rtNumber);

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'Agenda Warga', label: 'Agenda Warga' },
    { id: 'Kesehatan & Posyandu', label: 'Posyandu & Lansia' },
    { id: 'Keamanan & Ronda', label: 'Keamanan & Ronda' },
    { id: 'Kebersihan', label: 'Kebersihan' },
    { id: 'Penting / Darurat', label: 'Darurat' },
  ];

  // Text to speech handler
  const handlePlaySpeech = (ann: Announcement) => {
    if (playingId === ann.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    const speechText = `Pengumuman RT ${config.rtNumber}. ${ann.title}. ${ann.content}. Tanggal: ${formatDateIndo(ann.date)}. Lokasi: ${ann.location || 'Lingkungan RT'}.`;
    
    setPlayingId(ann.id);
    const success = playSpeechIndo(speechText, () => {
      setPlayingId(null);
    });

    if (!success) {
      alert('Perangkat Anda tidak mendukung pemutar suara otomatis.');
      setPlayingId(null);
    }
  };

  // WhatsApp share
  const handleShareWA = (ann: Announcement) => {
    const text = `*PENGUMUMAN RT ${config.rtNumber} / RW ${config.rwNumber} ${config.neighbourhoodName.toUpperCase()}*\n\n📌 *${ann.title}*\n\n${ann.content}\n\n🗓 *Tanggal:* ${formatDateIndo(ann.date)}\n📍 *Lokasi:* ${ann.location || 'Lingkungan RT'}\n👤 *Oleh:* ${ann.author}\n\n_Diteruskan dari Portal Warga RT Online_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Submit new announcement
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    onAddAnnouncement({
      title: formTitle.trim(),
      content: formContent.trim(),
      category: formCategory,
      date: new Date().toISOString().slice(0, 10),
      location: formLocation.trim() || 'Lingkungan RT ' + config.rtNumber,
      author: formAuthor.trim(),
      isPinned: false,
      priority: formPriority,
    });

    setFormTitle('');
    setFormContent('');
    setFormLocation('');
    setIsAddModalOpen(false);
  };

  // Filter & sort: Pinned first, then by date descending
  const filteredAnnouncements = announcements
    .filter((a) => activeCategory === 'all' || a.category === activeCategory)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.date < b.date ? 1 : -1;
    });

  return (
    <div className="space-y-8">
      
      {/* Title & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className={`font-bold tracking-tight text-slate-900 ${isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Pengumuman & Agenda Warga RT {config.rtNumber}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Informasi kegiatan gotong royong, jadwal posyandu, ronda, dan edaran resmi pengurus.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman</span>
          </button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Senior Help Notice for Audio Reader */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-amber-900">
              Bantuan Suara Otomatis untuk Lansia
            </div>
            <div className="text-xs text-amber-800">
              Klik tombol <span className="font-semibold underline">"Dengarkan Suara"</span> di setiap kartu pengumuman agar pesan dibacakan nyaring tanpa perlu membaca tulisan kecil.
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Cards List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
            Tidak ada pengumuman dalam kategori ini.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isPlaying = playingId === ann.id;
            const isDarurat = ann.priority === 'darurat';

            return (
              <article
                key={ann.id}
                className={`bg-white rounded-xl border p-5 sm:p-6 shadow-2xs transition-all relative ${
                  isDarurat
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : ann.isPinned
                    ? 'border-emerald-300 ring-1 ring-emerald-100'
                    : 'border-slate-200'
                }`}
              >
                {/* Header: Category & Pin */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-emerald-800 uppercase tracking-wide">
                      {ann.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateIndo(ann.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ann.isPinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Pin className="w-3 h-3 text-emerald-700" />
                        Disematkan
                      </span>
                    )}

                    {/* Admin Pin Toggle & Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          type="button"
                          onClick={() => onTogglePin(ann.id)}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded"
                          title={ann.isPinned ? 'Lepas sematan' : 'Sematkan di atas'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus pengumuman "${ann.title}"?`)) {
                              onDeleteAnnouncement(ann.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus pengumuman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Announcement Image if provided */}
                {ann.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden max-h-64 bg-slate-100 border border-slate-200">
                    <img
                      src={ann.imageUrl}
                      alt={ann.title}
                      className="w-full h-full object-cover max-h-64"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className={`font-bold text-slate-900 mb-2.5 ${
                  isSeniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}>
                  {ann.title}
                </h3>

                {/* Content */}
                <p className={`text-slate-700 leading-relaxed whitespace-pre-line mb-4 ${
                  isSeniorMode ? 'text-base sm:text-lg font-normal' : 'text-sm sm:text-base'
                }`}>
                  {ann.content}
                </p>

                {/* Metadata: Location & Author */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  {ann.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ann.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Diumumkan oleh: {ann.author}</span>
                  </div>
                </div>

                {/* Bottom Action Buttons: Audio Listen + WhatsApp Share */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  
                  {/* Audio Read-Aloud Button for Elderly */}
                  <button
                    type="button"
                    onClick={() => handlePlaySpeech(ann)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                      isPlaying
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Hentikan Suara</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-800" />
                        <span>Dengarkan Suara (Audio)</span>
                      </>
                    )}
                  </button>

                  {/* Share to WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleShareWA(ann)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Bagikan ke WhatsApp Warga</span>
                  </button>

                </div>

              </article>
            );
          })
        )}
      </div>

      {/* Admin Modal: Add Announcement */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Buat Pengumuman Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Kerja Bakti Bersih Selokan"
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Agenda Warga">Agenda Warga</option>
                    <option value="Kesehatan & Posyandu">Kesehatan & Posyandu</option>
                    <option value="Keamanan & Ronda">Keamanan & Ronda</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Penting / Darurat">Penting / Darurat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Prioritas
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="penting">Penting</option>
                    <option value="darurat">Darurat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Isi Pesan Pengumuman
                </label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tuliskan detail informasi, waktu pelaksanaan, dan hal yang perlu dipersiapkan warga..."
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Lokasi Pelaksanaan (Opsional)
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Contoh: Balai Pertemuan RT 05 atau Sepanjang Blok A"
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-2xs"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
