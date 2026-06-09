import React, { useState } from "react";
import { Announcement } from "../types";
import { Megaphone, Search, PlusCircle, Trash2, Calendar, FileText, Image as ImageIcon, ExternalLink, User } from "lucide-react";

interface PengumumanViewProps {
  announcements: Announcement[];
  isAdminOrPengurus: boolean;
  onAddAnnouncement: (item: Omit<Announcement, "id" | "date">) => void;
  onDeleteAnnouncement: (id: string) => void;
  currentUser: { name: string; role: string };
}

export default function PengumumanView({
  announcements,
  isAdminOrPengurus,
  onAddAnnouncement,
  onDeleteAnnouncement,
  currentUser,
}: PengumumanViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new announcement
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Announcement["category"]>("OSIS");
  const [newContent, setNewContent] = useState("");
  const [newAttachName, setNewAttachName] = useState("");
  const [newAttachType, setNewAttachType] = useState<Announcement["attachmentType"]>("pdf");

  const filtered = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "Semua" || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: currentUser.name,
      attachmentName: newAttachName || undefined,
      attachmentType: newAttachName ? newAttachType : undefined,
    });

    // Reset fields
    setNewTitle("");
    setNewContent("");
    setNewAttachName("");
    setShowAddModal(false);
  };

  const downloadAttachment = (name: string) => {
    alert(`Mensimulasikan unduh lampiran: "${name}"\nBerhasil mengunduh dokumen dari penyimpanan aman Portal OSIS.`);
  };

  return (
    <div className="space-y-6" id="pengumuman-panel-container">
      {/* View Header - Light themed */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 animate-pulse">
              <Megaphone className="h-6 w-6" />
            </div>
            Pengumuman Terbaru
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Informasi penting sekolah, agenda rapat pengurus, dan jadwal lomba terintegrasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50 pl-5 pr-4 pl-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {isAdminOrPengurus && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Buat Pengumuman
            </button>
          )}
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-2">
        {["Semua", "Sekolah", "OSIS", "Rapat", "Lomba"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border ${
              activeTab === tab
                ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                : "bg-slate-50 text-slate-500 border-slate-100 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            {tab === "Semua" ? "Semua Kategori" : tab}
          </button>
        ))}
      </div>

      {/* Main Grid display - High contrast cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="announcements-grid-row">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between"
            id={`ann-card-${item.id}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                    item.category === "Sekolah"
                      ? "bg-red-50 text-red-650 border-red-150"
                      : item.category === "OSIS"
                      ? "bg-blue-50 text-blue-650 border-blue-150"
                      : item.category === "Rapat"
                      ? "bg-purple-50 text-purple-650 border-purple-150"
                      : "bg-amber-50 text-amber-650 border-amber-150"
                  }`}
                >
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold font-mono">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mt-3.5 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-slate-650 text-xs md:text-sm leading-relaxed mt-2.5 whitespace-pre-line font-medium">
                {item.content}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <User className="h-4 w-4 text-slate-400" />
                <span>Oleh: <strong className="text-slate-800 font-extrabold">{item.author}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {item.attachmentName && (
                  <button
                    onClick={() => downloadAttachment(item.attachmentName!)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  >
                    {item.attachmentType === "pdf" ? (
                      <FileText className="h-3.5 w-3.5 text-red-500" />
                    ) : item.attachmentType === "image" ? (
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span className="truncate max-w-[100px]">{item.attachmentName}</span>
                    <ExternalLink className="h-3 w-3 text-slate-450" />
                  </button>
                )}

                {isAdminOrPengurus && (
                  <button
                    onClick={() => onDeleteAnnouncement(item.id)}
                    className="p-1 px-2 text-xs font-semibold text-rose-550 hover:text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl">
            <p className="text-slate-500 text-xs font-semibold">Belum ada pengumuman terdaftar di kategori ini.</p>
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative animate-scale-up">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Buat Pengumuman Baru</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembagian Atribut Baru OSIS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Announcement["category"])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="OSIS">OSIS</option>
                    <option value="Rapat">Rapat</option>
                    <option value="Lomba">Lomba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Keterangan Penulis
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.name} (${currentUser.role})`}
                    className="w-full rounded-xl border border-slate-150 bg-slate-100 px-4 py-2.5 text-xs text-slate-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Konten Pengumuman
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan detail pengumuman secara padat, jelas dan resmi..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Nama Lampiran (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SK_Lomba_Futsal.pdf"
                    value={newAttachName}
                    onChange={(e) => setNewAttachName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Format Lampiran
                  </label>
                  <select
                    value={newAttachType}
                    onChange={(e) => setNewAttachType(e.target.value as Announcement["attachmentType"])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-850 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="pdf">PDF Dokumen</option>
                    <option value="docx">Word DOCX</option>
                    <option value="image">Gambar JPG/PNG</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Simpan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
