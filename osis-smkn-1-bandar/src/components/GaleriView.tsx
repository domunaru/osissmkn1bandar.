import React, { useState } from "react";
import { Images, Eye, Award } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  album: string;
  gradient: string;
  description: string;
}

const ALBUM_DATA: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Upacara Peringatan Hari Pendidikan Nasional",
    date: "2026-05-02",
    album: "Upacara & Kenegaraan",
    gradient: "from-blue-600 via-indigo-600 to-sky-700",
    description: "Khidmatnya seluruh siswa dan guru SMKN 1 Bandar memperingati Hari Pendidikan Nasional tahun 2026.",
  },
  {
    id: "gal-2",
    title: "Turnamen Olahraga Futsal Cup Antar Kelas XII",
    date: "2026-04-18",
    album: "Turnamen Olahraga",
    gradient: "from-orange-500 via-amber-500 to-yellow-600",
    description: "Aksi spektakuler para tim olahraga memenangkan piala bergengsi OSIS Futsal Cup Semester Genap.",
  },
  {
    id: "gal-3",
    title: "Pentas Seni Kreatif & Gelar Hasil Karya Wirausaha",
    date: "2026-03-24",
    album: "Pentas Seni",
    gradient: "from-pink-600 via-purple-600 to-fuchsia-700",
    description: "Kegiatan unjuk bakat musikalitas, pentas teater sastra, dan pemasaran kerajinan siswa hasil Seksi Kewirausahaan.",
  },
  {
    id: "gal-4",
    title: "Sosialisasi Bahaya Mengemudi Remaja & Tertib Lalin",
    date: "2026-03-12",
    album: "Sosialisasi Akademis",
    gradient: "from-emerald-600 via-teal-600 to-green-700",
    description: "Bekerja sama dengan Satlantas Sektor setempat demi menjaga keselamatan berkendara seluruh siswa.",
  }
];

export default function GaleriView() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <div className="space-y-6" id="galeri-container">
      {/* Header section */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Images className="h-6 w-6 text-blue-500" />
          Galeri & Dokumentasi Kegiatan
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Kilas dokumentasi foto dan video album seluruh rangkaian kegiatan yang diprakarsai oleh pengurus OSIS SMKN 1 Bandar
        </p>
      </div>

      {/* Grid records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="gallery-grid">
        {ALBUM_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/10 cursor-pointer transition-all flex flex-col justify-between"
            id={`gallery-item-${item.id}`}
          >
            <div>
              {/* Cover Gradient/Watermark Illustration layout */}
              <div className={`h-36 bg-gradient-to-tr ${item.gradient} flex items-center justify-center p-4 relative text-center text-white`}>
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                <Award className="h-8 w-8 opacity-25 z-10" />
                <span className="absolute bottom-3 right-3 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono border border-white/10 z-10">
                  {item.album}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <p className="text-[10px] text-slate-500 font-mono font-medium">{item.date}</p>
                <h3 className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 text-[10.5px] text-blue-400 flex items-center gap-1 font-semibold mt-2">
              <Eye className="h-3.5 w-3.5" /> Pratinjau Album
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl relative">
            {/* Symbolic decorative big placeholder banner */}
            <div className={`aspect-video w-full bg-gradient-to-tr ${activeItem.gradient} rounded-2xl flex items-center justify-center text-white p-6 relative overflow-hidden`}>
              <Images className="h-16 w-16 opacity-15" />
              <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono">
                {activeItem.album}
              </div>
            </div>

            <h3 className="text-md font-bold text-slate-100 mt-4">{activeItem.title}</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono font-semibold">Dokumentasi: {activeItem.date}</p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed leading-relaxed leading-relaxed leading-relaxed leading-relaxed leading-relaxed whitespace-pre-line">
              {activeItem.description}
            </p>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-800/80 pt-4">
              <button
                onClick={() => {
                  alert(`Berhasil Mengunduh!\nSeluruh 12 dokumentasi foto kualitas ultra-hd dari album "${activeItem.title}" berhasil diunduh ke folder Downloads.`);
                  setActiveItem(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Unduh Semua Foto Album (.ZIP)
              </button>
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
