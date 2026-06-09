import React, { useState } from "react";
import { StudentAspiration } from "../types";
import { HandHelping, PlusCircle, Reply, CheckCircle2, ChevronUp } from "lucide-react";

interface AspirasiViewProps {
  aspirations: StudentAspiration[];
  isAdminOrPengurus: boolean;
  onAddAspiration: (item: Omit<StudentAspiration, "id" | "date" | "status" | "upvotes">) => void;
  onRespondAspiration: (id: string, response: string) => void;
  onUpvoteAspiration: (id: string) => void;
  currentUser: { name: string; role: string };
}

export default function AspirasiView({
  aspirations,
  isAdminOrPengurus,
  onAddAspiration,
  onRespondAspiration,
  onUpvoteAspiration,
  currentUser,
}: AspirasiViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<StudentAspiration["category"]>("Kritik & Saran");
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeRespondId, setActiveRespondId] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddAspiration({
      category,
      text,
      isAnonymous,
      authorName: isAnonymous ? "Siswa Anonim" : currentUser.name,
    });

    setText("");
    setIsAnonymous(false);
    setShowForm(false);
  };

  const handleRespondSubmit = (id: string) => {
    if (!responseMsg.trim()) return;
    onRespondAspiration(id, responseMsg);
    setResponseMsg("");
    setActiveRespondId(null);
  };

  return (
    <div className="space-y-6" id="aspirasi-container">
      {/* Header section - Light themed with high contrast */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-205 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <HandHelping className="h-6 w-6" />
            </div>
            Suara &amp; Aspirasi Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Saluran bebas menyampaikan kritik konstruktif, usulan fasilitas, atau saran kegiatan secara transparan
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-start md:self-center"
        >
          <PlusCircle className="h-4 w-4" />
          {showForm ? "Tutup Formulir" : "Kirim Aspirasi"}
        </button>
      </div>

      {/* Write Aspiration Collapse Panel */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Formulir Kirim Aspirasi</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Kategori Aspirasi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudentAspiration["category"])}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-850 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="Kritik & Saran">Kritik &amp; Saran</option>
                <option value="Fasilitas">Infrastruktur &amp; Fasilitas Kelas</option>
                <option value="Kegiatan">Usulan Kegiatan OSIS</option>
                <option value="Kantin">Kebersihan &amp; Menu Kantin</option>
                <option value="Lainnya">Lainnya / Umum</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-slate-55 border border-slate-200 rounded-xl max-sm:mt-2 h-[42px] self-end">
              <input
                id="anonymous-toggle"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-305 rounded cursor-pointer accent-blue-600 focus:ring-0"
              />
              <label htmlFor="anonymous-toggle" className="text-xs text-slate-700 font-semibold cursor-pointer ml-1.5">
                Kirim sebagai Siswa Anonim (Nama disembunyikan)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Isi Aspirasi Anda
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan keluhan atau saran Anda secara beretika, jelas dan berikan solusi rekonstruktif..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Kirim Ke Kotak Saran
            </button>
          </div>
        </form>
      )}

      {/* Aspirations Feed lists */}
      <div className="space-y-4" id="aspirations-feed">
        {currentUser?.name === "Jumpa Pardomuan Butar Butar" ? (
          <>
            {aspirations.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header pill details */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                        {item.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          item.status === "Baru"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : item.status === "Diproses"
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                      >
                        • {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                      <span>📅 {item.date}</span>
                      <span>•</span>
                      <span>Oleh: <strong className="text-slate-800">{item.isAnonymous ? "Siswa Anonim" : item.authorName}</strong></span>
                    </div>
                  </div>

                  {/* Upvote support */}
                  <button
                    onClick={() => onUpvoteAspiration(item.id)}
                    className="flex flex-col items-center gap-0.5 bg-slate-50 p-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-105 transition-all cursor-pointer group"
                  >
                    <ChevronUp className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-transform group-hover:-translate-y-0.5" />
                    <span className="text-xs font-bold font-mono">{item.upvotes}</span>
                  </button>
                </div>

                {/* Content Text */}
                <p className="text-xs md:text-sm text-slate-850 leading-relaxed font-sans whitespace-pre-line font-medium">
                  "{item.text}"
                </p>

                {/* Responses display */}
                {item.adminResponse ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 mt-4">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Tanggapan Resmi Pengurus:
                      </div>
                      <p className="text-xs text-slate-700 font-medium italic mt-1 leading-relaxed">
                        "{item.adminResponse}"
                      </p>
                    </div>
                  </div>
                ) : (
                  isAdminOrPengurus && (
                    <div className="pt-3 border-t border-slate-100" id={`respond-action-${item.id}`}>
                      {activeRespondId === item.id ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            rows={2}
                            placeholder="Tuliskan solusi tindak lanjut dari pengurus..."
                            value={responseMsg}
                            onChange={(e) => setResponseMsg(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setActiveRespondId(null)}
                              className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleRespondSubmit(item.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer animate-pulse"
                            >
                              Kirim Tanggapan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveRespondId(item.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-700 font-bold cursor-pointer"
                        >
                          <Reply className="h-3.5 w-3.5 text-blue-500" />
                          Tanggapi Aspirasi Ini
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}

            {aspirations.length === 0 && (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl">
                <p className="text-slate-500 text-xs font-semibold">Belum ada aspirasi terdaftar dari siswa.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 max-w-lg mx-auto">
            <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Saran &amp; Laporan Tersimpan Aman</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5 font-semibold">
                Demi kenyamanan dan perlindungan kerahasiaan data pelapor, tumpukan saran masuk bersifat konfidensial. Seluruh saran dikumpulkan langsung dan hanya dapat diakses oleh Seksi Informasi &amp; Komunikasi (Developer: Jumpa) untuk diverifikasi dan ditindaklanjuti.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
