import React, { useState } from "react";
import { NewsArticle } from "../types";
import { Award, BookOpen, Clock, Search, BookMarked, MessageCircle } from "lucide-react";

export const INITIAL_NEWS: NewsArticle[] = [];

export default function BeritaView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = INITIAL_NEWS.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="berita-container">
      {/* Header controls - clean light design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <BookMarked className="h-6 w-6" />
            </div>
            Kabar Berita &amp; Prestasi Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Artikel pendidikan, berita kegiatan sekolah resmi, serta sorotan prestasi gemilang akademis dan non-akademis
          </p>
        </div>

        <div className="relative shrink-0 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kabar berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-slate-250 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Roster display or beautiful empty state */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-grid-displays">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            id={`news-${item.id}`}
          >
            <div>
              <div className={`h-40 ${item.imageUrl} flex items-center justify-center p-6 text-center text-white relative group-hover:scale-[1.01] transition-transform`}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                <span className="text-sm font-bold font-serif uppercase tracking-widest z-10 px-4 py-2 bg-slate-950/40 rounded-xl border border-white/15 backdrop-blur-sm line-clamp-2">
                  {item.title}
                </span>

                <span className="absolute top-4 left-4 bg-blue-600 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-blue-500">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-[10.5px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-450" />
                    {item.date}
                  </span>
                  <span>•</span>
                  <span>Penulis: {item.author}</span>
                </div>

                <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans line-clamp-5">
                  {item.content}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex justify-between items-center text-xs mt-4">
              <button
                onClick={() => alert(`Membuka Artikel Lengkap:\n"${item.title}"\nSistem mengonfirmasi pengalihan aman ke portal buletin OSIS SMKN 1 Bandar.`)}
                className="text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Baca Artikel <BookOpen className="h-4 w-4" />
              </button>

              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> 8 Komentar
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto">
          <BookMarked className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-extrabold text-slate-800">Kabar &amp; Prestasi Kosong</h3>
          <p className="text-xs text-slate-405 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Belum ada kabar berita atau dokumentasi prestasi terbaru yang diunggah saat ini. Silakan kembali lagi nanti untuk informasi menarik lainnya!
          </p>
        </div>
      )}
    </div>
  );
}
