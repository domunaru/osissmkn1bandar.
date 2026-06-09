import React, { useState } from "react";
import { MeetingMinute } from "../types";
import {
  FileText,
  Search,
  PlusCircle,
  Trash2,
  Calendar,
  MapPin,
  User,
  Users,
  ClipboardCheck,
  Plus,
  X,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";

interface NotulensiViewProps {
  minutes: MeetingMinute[];
  isAdminOrPengurus: boolean;
  onAddMinute: (item: Omit<MeetingMinute, "id">) => void;
  onDeleteMinute: (id: string) => void;
  currentUser: { name: string; role: string } | null;
}

export default function NotulensiView({
  minutes,
  isAdminOrPengurus,
  onAddMinute,
  onDeleteMinute,
  currentUser,
}: NotulensiViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(
    minutes.length > 0 ? minutes[0] : null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new minute
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newLeader, setNewLeader] = useState("");
  const [newSecretary, setNewSecretary] = useState("");
  const [newAttendeesCount, setNewAttendeesCount] = useState<number>(15);
  const [newContent, setNewContent] = useState("");
  const [newDecisions, setNewDecisions] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filteredMinutes = minutes.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.decisions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newContent.trim() || !newDecisions.trim()) {
      alert("Harap lengkapi semua field wajib (Judul, Tanggal, Isi Notulensi, dan Keputusan Rapat).");
      return;
    }

    onAddMinute({
      title: newTitle,
      date: newDate,
      location: newLocation || "Ruang OSIS SMKN 1 Bandar",
      leader: newLeader || currentUser?.name || "Zora Rizky Salsabila",
      secretary: newSecretary || "Grace Aurelia",
      attendeesCount: Number(newAttendeesCount) || 12,
      content: newContent,
      decisions: newDecisions,
      notes: newNotes || undefined,
      author: currentUser?.name || "Pengurus OSIS",
    });

    // Reset Form
    setNewTitle("");
    setNewDate("");
    setNewLocation("");
    setNewLeader("");
    setNewSecretary("");
    setNewAttendeesCount(15);
    setNewContent("");
    setNewDecisions("");
    setNewNotes("");
    setShowAddModal(false);
  };

  // Auto select first entry if selected entry is deleted
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus arsip notulensi rapat ini secara permanen?"
    );
    if (!confirmDelete) return;

    onDeleteMinute(id);
    if (selectedMinute?.id === id) {
      const remaining = minutes.filter((m) => m.id !== id);
      setSelectedMinute(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <div className="space-y-6" id="notulensi-view-container">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-6 rounded-3xl border border-slate-800 text-white">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            Arsip Notulensi Rapat OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Dokumentasi keputusan, program kerja, evaluasi bulanan, dan risalah resmi rapat internal OSIS SMKN 1 Bandar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari risalah rapat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60 rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {isAdminOrPengurus && (
            <button
              onClick={() => {
                setNewDate(new Date().toISOString().substring(0, 10));
                setNewLeader(currentUser?.name || "");
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Notulensi Baru
            </button>
          )}
        </div>
      </div>

      {minutes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Notulensi</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Daftar risalah rapat masih kosong. Klik tombol 'Notulensi Baru' untuk mulai menambahkan catatan rapat resmi OSIS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of meeting Minutes */}
          <div className="lg:col-span-5 space-y-3 lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Daftar Rapat ({filteredMinutes.length})
            </p>
            {filteredMinutes.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMinute(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedMinute?.id === item.id
                    ? "bg-blue-50/75 border-blue-200 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                  {isAdminOrPengurus && (
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Notulensi"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            ))}
            {filteredMinutes.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Pencarian tidak menemukan hasil.
              </p>
            )}
          </div>

          {/* Right Column: Selected Minute Details Pane */}
          <div className="lg:col-span-7 lg:sticky lg:top-4 lg:max-h-[calc(100vh-240px)] lg:overflow-y-auto pr-1">
            {selectedMinute ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 px-2.5 py-0.5 rounded-full border border-blue-200/50 uppercase tracking-widest inline-block mb-3">
                    Risalah Resmi Rapat
                  </span>
                  <h3 className="text-md sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {selectedMinute.title}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 leading-none">TANGGAL</p>
                        <p className="mt-1 text-[11px] font-bold text-slate-800">{selectedMinute.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-bold text-slate-400 leading-none">TEMPAT</p>
                        <p className="mt-1 text-[11px] font-bold text-slate-800 truncate" title={selectedMinute.location}>
                          {selectedMinute.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                      <Users className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 leading-none">HADIRIN</p>
                        <p className="mt-1 text-[11px] font-bold text-slate-800">{selectedMinute.attendeesCount} Peserta</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Roles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 text-xs">
                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-150 flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">PIMPINAN RAPAT</span>
                      <strong className="text-slate-800 font-bold block mt-0.5">{selectedMinute.leader}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-150 flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">NOTULIS / PENCATAT</span>
                      <strong className="text-slate-800 font-bold block mt-0.5">{selectedMinute.secretary}</strong>
                    </div>
                  </div>
                </div>

                {/* Main Content (Pokok Bahasan) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-500" />
                    Pokok Pembahasan Rapat
                  </h4>
                  <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-150 text-slate-605 leading-relaxed text-xs sm:text-sm whitespace-pre-line text-justify">
                    {selectedMinute.content}
                  </div>
                </div>

                {/* Decisions (Keputusan) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                    Keputusan &amp; Hasil Rapat (Wajib Dilaksanakan)
                  </h4>
                  <div className="bg-emerald-50/30 rounded-2xl p-4 sm:p-5 border border-emerald-100 text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line text-justify">
                    {selectedMinute.decisions}
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedMinute.notes && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Catatan Tambahan &amp; Tindak Lanjut
                    </h4>
                    <p className="text-slate-500 text-xs italic pl-4 border-l-2 border-slate-300 leading-relaxed">
                      {selectedMinute.notes}
                    </p>
                  </div>
                )}

                {/* Bottom author and label */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Dibuat oleh: <strong className="text-slate-700">{selectedMinute.author}</strong></span>
                  <span>ID: {selectedMinute.id}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#f8fafc] rounded-3xl border border-dashed border-slate-200 p-16 text-center h-full flex flex-col justify-center items-center">
                <FileText className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-xs text-slate-400">Pilih salah satu rapat untuk menampilkan lembar notulensi lengkap.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Notulensi Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-slate-150 flex items-center justify-between z-10">
              <h3 className="text-md sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Tulis Notulensi Rapat Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Judul Pertemuan / Rapat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rapat Evaluasi Class Meeting"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Tanggal Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Tempat / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang OSIS"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Pimpinan Rapat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Zora Salsabila"
                    value={newLeader}
                    onChange={(e) => setNewLeader(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Notulis / Pencatat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Grace Aurelia"
                    value={newSecretary}
                    onChange={(e) => setNewSecretary(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Jumlah Hadirin / Peserta Rapat
                </label>
                <input
                  type="number"
                  min="1"
                  value={newAttendeesCount}
                  onChange={(e) => setNewAttendeesCount(Math.max(1, Number(e.target.value)))}
                  className="w-full sm:w-1/3 text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-850"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Pokok Pembahasan / Isi Notulensi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Deskripsikan dengan detail risalah perbincangan, pemaparan program, evaluasi kinerja, atau diskusi gagasan..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block mb-1.5">
                  Keputusan &amp; Hasil Akhir (Per Poin) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Masukkan poin-poin kesepakatan akhir rapat. Contoh:&#10;1. Class meeting disetujui tgl 18 Maret.&#10;2. Pengumpulan dana kas diserahkan ke Bendahara."
                  value={newDecisions}
                  onChange={(e) => setNewDecisions(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-250 bg-slate-50 focus:bg-emerald-50/20 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Catatan Tambahan &amp; Tindak Lanjut
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Deadline proposal anggaran tanggal 10 maret."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Modal Footer actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Simpan Notulensi Resmi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
