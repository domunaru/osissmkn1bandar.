import React, { useState } from "react";
import { OsisEvent, OsisProker } from "../types";
import {
  Calendar,
  MapPin,
  Tag,
  PlusCircle,
  CheckCircle,
  QrCode,
  Award,
  X,
  Search,
  ShieldCheck,
  Briefcase,
  Coins,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bookmark,
  FileText,
  Activity,
  Layers,
  Compass
} from "lucide-react";

export const SEKBID_LIST = [
  "Seksi Keimanan dan Ketakwaan",
  "Seksi Budi Pekerti Luhur dan Akhlak Mulia",
  "Seksi Kehidupan Berbangsa",
  "Seksi Akademik, Seni dan Olahraga",
  "Seksi Demokrasi dan Lingkungan Hidup",
  "Seksi Kreativitas dan Kewirausahaan",
  "Seksi Jasmani, Kesehatan dan Gizi",
  "Seksi Sastra dan Budaya",
  "Seksi Informasi dan Komunikasi"
];

interface KegiatanViewProps {
  events: OsisEvent[];
  prokers?: OsisProker[];
  isAdminOrPengurus: boolean;
  currentUser: { name: string; role: string };
  onAddEvent: (item: Omit<OsisEvent, "id" | "registeredUsers" | "date">) => void;
  onRegisterEvent: (eventId: string, userName: string) => void;
  onCheckAttendance: (eventId: string, userName: string) => void;
  onAddProker?: (item: Omit<OsisProker, "id">) => void;
  onUpdateProkerStatus?: (prokerId: string, status: OsisProker["status"]) => void;
}

export default function KegiatanView({
  events,
  prokers = [],
  isAdminOrPengurus,
  currentUser,
  onAddEvent,
  onRegisterEvent,
  onCheckAttendance,
  onAddProker,
  onUpdateProkerStatus,
}: KegiatanViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"prokers" | "events">("prokers");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("Semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [scannedEventId, setScannedEventId] = useState<string | null>(null);
  const [certificateEvent, setCertificateEvent] = useState<OsisEvent | null>(null);

  // States for Proker filter and forms
  const [selectedSekbidFilter, setSelectedSekbidFilter] = useState("Semua");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Semua");
  const [showAddProkerModal, setShowAddProkerModal] = useState(false);

  // Proker Form states
  const [prokerTitle, setProkerTitle] = useState("");
  const [prokerDesc, setProkerDesc] = useState("");
  const [prokerSekbid, setProkerSekbid] = useState(SEKBID_LIST[0]);
  const [prokerStatus, setProkerStatus] = useState<OsisProker["status"]>("Direncanakan");
  const [prokerTarget, setProkerTarget] = useState("");
  const [prokerBudget, setProkerBudget] = useState("");
  const [prokerDate, setProkerDate] = useState("");

  // Filtering actions for physical events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === "Semua" || ev.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtering actions for Sekbid prokers
  const filteredProkers = prokers.filter((pk) => {
    const matchesSearch =
      pk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pk.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSekbid = selectedSekbidFilter === "Semua" || pk.sekbid === selectedSekbidFilter;
    const matchesStatus = selectedStatusFilter === "Semua" || pk.status === selectedStatusFilter;
    return matchesSearch && matchesSekbid && matchesStatus;
  });

  // Create Event Form Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    onAddEvent({
      title: newTitle,
      location: newLocation,
      description: newDesc,
      category: newCategory,
      status: newStatus,
    });

    setNewTitle("");
    setNewLocation("");
    setNewDesc("");
    setShowAddModal(false);
  };

  // Create Proker Form Handler
  const handleCreateProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prokerTitle.trim() || !prokerDesc.trim()) {
      alert("Harap isi Judul dan Deskripsi Program Kerja !");
      return;
    }

    if (onAddProker) {
      onAddProker({
        title: prokerTitle,
        description: prokerDesc,
        sekbid: prokerSekbid,
        status: prokerStatus,
        target: prokerTarget || "Siswa SMKN 1 Bandar",
        budget: Number(prokerBudget) || 0,
        date: prokerDate || "TBA",
      });
    }

    // Reset Form states
    setProkerTitle("");
    setProkerDesc("");
    setProkerTarget("");
    setProkerBudget("");
    setProkerDate("");
    setShowAddProkerModal(false);
  };

  // Form states for adding activities
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<OsisEvent["category"]>("Umum");
  const [newStatus, setNewStatus] = useState<OsisEvent["status"]>("Mendatang");

  const currentYear = "2026/2027";

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Stats Counters
  const totalProkesLength = prokers.length;
  const runningProkers = prokers.filter((p) => p.status === "Berjalan").length;
  const completedProkers = prokers.filter((p) => p.status === "Selesai").length;
  const plannedProkers = prokers.filter((p) => p.status === "Direncanakan").length;
  const totalAllocatedBudget = prokers.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="space-y-6" id="kegiatan-container">
      
      {/* 1. Header Segment with Premium Dark theme wrapper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-blue-500 animate-pulse" />
            Program Kerja &amp; Kegiatan OSIS
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Portal digital perumusan dan kemajuan Program Kerja per Sekbid (Seksi Bidang) SMKN 1 Bandar beserta pendaftaran online dan sertifikasi event terpadu.
          </p>
        </div>

        {/* Outer Tab Selector Buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 Self-start md:self-center">
          <button
            onClick={() => setActiveSubTab("prokers")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === "prokers"
                ? "bg-blue-600/25 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Program Kerja ({prokers.length})
          </button>
          <button
            onClick={() => setActiveSubTab("events")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === "events"
                ? "bg-blue-600/25 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Pendaftaran Event ({events.length})
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB VIEW 1: PROGRAM KERJA SEKBID */}
      {activeSubTab === "prokers" && (
        <div className="space-y-6" id="proker-sekbid-workspace">
          
          {/* Quick Dashboard Stats Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-blue-500" />
                Total Program Kerja
              </span>
              <p className="text-2xl font-black text-slate-100 mt-2">{totalProkesLength} <span className="text-xs text-slate-500 font-normal">proker</span></p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                Proker Aktif / Berjalan
              </span>
              <p className="text-2xl font-black text-slate-100 mt-2">{runningProkers} <span className="text-xs text-slate-500 font-normal">berjalan</span></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Proker Rampung Selesai
              </span>
              <p className="text-2xl font-black text-slate-100 mt-2">{completedProkers} <span className="text-xs text-slate-500 font-normal">selesai</span></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-rose-500" />
                Estimasi Total Kas Kerja
              </span>
              <p className="text-lg font-black text-slate-100 mt-2 truncate text-rose-400">{formatIDR(totalAllocatedBudget)}</p>
            </div>
          </div>

          {/* Filtering Widgets and Add Proker Command bar */}
          <div className="flex flex-col xl:flex-row gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm justify-between">
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {/* Search Prokers */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari program kerja..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-slate-700 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Sekbid Filter Dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Sekbid:</span>
                <select
                  value={selectedSekbidFilter}
                  onChange={(e) => setSelectedSekbidFilter(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-slate-700 focus:outline-none focus:bg-white w-full sm:w-60"
                >
                  <option value="Semua">Semua Seksi Bidang (Sekbid)</option>
                  {SEKBID_LIST.map((sk, idx) => (
                    <option key={idx} value={sk}>Seksi {idx+1}: {sk.replace("Seksi ", "")}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter Dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-slate-700 focus:outline-none focus:bg-white w-full sm:w-40"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Direncanakan">Direncanakan</option>
                  <option value="Berjalan">Berjalan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            {/* Create Proker Button (Admin panel) */}
            {isAdminOrPengurus && (
              <button
                onClick={() => setShowAddProkerModal(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-505 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start xl:self-center shadow-lg hover:shadow-indigo-500/10"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Tambah Proker Sekbid
              </button>
            )}
          </div>

          {/* Grid display cards of Proker */}
          {filteredProkers.length === 0 ? (
            <div className="bg-slate-100/50 border border-dashed border-slate-250 p-12 text-center rounded-2xl max-w-md mx-auto my-6">
              <Briefcase className="h-10 w-10 text-slate-350 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Program Kerja</h4>
              <p className="text-xs text-slate-400">Tidak ada program kerja sekbid yang cocok dengan pencarian atau kriteria modul filter saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProkers.map((pro) => {
                // Get sekbid index for number sign
                const sekbidIndex = SEKBID_LIST.indexOf(pro.sekbid) + 1;
                
                return (
                  <div
                    key={pro.id}
                    className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Header with status or Sekbid label */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Sekbid {sekbidIndex || "Inti"}
                          </span>

                          {/* Editable status for Admin or Pengurus */}
                          {isAdminOrPengurus && onUpdateProkerStatus ? (
                            <select
                              value={pro.status}
                              onChange={(e) => onUpdateProkerStatus(pro.id, e.target.value as OsisProker["status"])}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${
                                pro.status === "Direncanakan"
                                  ? "bg-slate-50 text-slate-600 border-slate-200"
                                  : pro.status === "Berjalan"
                                  ? "bg-amber-50 text-amber-600 border-amber-250"
                                  : pro.status === "Selesai"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-250"
                                  : "bg-rose-50 text-rose-600 border-rose-250"
                              }`}
                            >
                              <option value="Direncanakan">Direncanakan</option>
                              <option value="Berjalan">Berjalan</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          ) : (
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                pro.status === "Direncanakan"
                                  ? "bg-slate-50 text-slate-550 border-slate-200"
                                  : pro.status === "Berjalan"
                                  ? "bg-amber-50 text-amber-550 border-amber-100"
                                  : pro.status === "Selesai"
                                  ? "bg-emerald-50 text-emerald-555 border-emerald-100"
                                  : "bg-rose-50 text-rose-550 border-rose-100"
                              }`}
                            >
                              {pro.status}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono tracking-tight font-medium leading-relaxed truncate">
                          {pro.sekbid}
                        </p>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                          {pro.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
                          {pro.description}
                        </p>
                      </div>

                      {/* Stats Table details */}
                      <div className="space-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1">🎯 Sasaran Target:</span>
                          <span className="font-semibold text-slate-700 truncate max-w-[150px]">{pro.target}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1">💸 Estimasi Kas:</span>
                          <span className="font-extrabold text-blue-600">{pro.budget === 0 ? "Tanpa Anggaran" : formatIDR(pro.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1">📅 Jendela Pelaksanaan:</span>
                          <span className="font-semibold text-slate-700">{pro.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-TAB VIEW 2: REGISTER EVENTS */}
      {activeSubTab === "events" && (
        <div className="space-y-6" id="physical-events-workspace">
          
          {/* Filtering Widgets for Events */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/85 p-5 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search events */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kegiatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 text-xs rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-slate-700 bg-slate-50 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:inline">Filter:</span>
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {["Semua", "Umum", "Lomba", "Sosialisasi", "Rapat Internal"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        activeCategoryFilter === cat
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-850"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Manual ADD event Button */}
            {isAdminOrPengurus && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Tambah Kegiatan
              </button>
            )}
          </div>

          {/* Grid display cards of physical events */}
          {filteredEvents.length === 0 ? (
            <div className="bg-slate-100/50 border border-dashed border-slate-250 p-12 text-center rounded-2xl max-w-md mx-auto my-6">
              <Calendar className="h-10 w-10 text-slate-350 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Kegiatan</h4>
              <p className="text-xs text-slate-400">Belum ada agenda kegiatan fisik terawat dalam database saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-grid-row">
              {filteredEvents.map((item) => {
                const isRegistered = item.registeredUsers.includes(currentUser.name);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
                    id={`event-card-${item.id}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                          <Tag className="h-2.5 w-2.5" />
                          {item.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "Mendatang"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : item.status === "Berlangsung"
                              ? "bg-sky-50 text-sky-600 border border-sky-100"
                              : "bg-slate-50 text-slate-500 border border-slate-100"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>👥 Pendaftar:</span>
                          <span className="font-bold text-slate-700">{item.registeredUsers.length} Siswa</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-4 flex flex-wrap gap-2 justify-between items-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      {/* Active Actions button selectors */}
                      <div className="flex gap-2">
                        {isRegistered ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Terdaftar
                          </span>
                        ) : (
                          <button
                            onClick={() => onRegisterEvent(item.id, currentUser.name)}
                            disabled={item.status === "Selesai"}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                          >
                            Daftar Sekarang
                          </button>
                        )}

                        {isRegistered && item.status !== "Mendatang" && (
                          <button
                            onClick={() => setScannedEventId(item.id)}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-150 transition-all flex items-center gap-1 cursor-pointer"
                            title="Simulasi QR Scan Absen Kehadiran"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold hidden sm:inline">Absen QR</span>
                          </button>
                        )}
                      </div>

                      {/* Claim Certificate for Finished events */}
                      {item.status === "Selesai" && (
                        <button
                          onClick={() => setCertificateEvent(item)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 text-amber-700 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Award className="h-4 w-4" />
                          Sertifikat
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MODALS PANEL: TAMBAH KEGIATAN BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Tambah Kegiatan Baru</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-405 mb-1">
                  Nama Kegiatan / Event
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Turnamen Futsal Cup 2026..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as OsisEvent["category"])}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Lomba">Lomba (Class Meeting)</option>
                    <option value="Sosialisasi">Sosialisasi</option>
                    <option value="Rapat Internal">Rapat Internal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Status Kegiatan
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OsisEvent["status"])}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="Mendatang">Mendatang</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Lokasi Tempat Pelaksanaan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Lapangan Basket Utara, Aula Utama..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Deskripsi Singkat &amp; Detail Acara
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan tujuan dan sasaran peserta kegiatan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                >
                  Tambah Kegiatan Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODALS PANEL: TAMBAH PROKER SEKBID BARU */}
      {showAddProkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProkerModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Kirim Usulan Program Kerja (Proker)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Rumuskan koordinasi kegiatan sekbid secara taktis transparan.</p>

            <form onSubmit={handleCreateProker} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Judul Proker Sekbid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bazar Kewirausahaan Mandiri, Liga Futsal Kelas..."
                  value={prokerTitle}
                  onChange={(e) => setProkerTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Pilar Seksi Bidang Pelaksana <span className="text-red-500">*</span>
                </label>
                <select
                  value={prokerSekbid}
                  onChange={(e) => setProkerSekbid(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 focus:outline-none cursor-pointer"
                >
                  {SEKBID_LIST.map((sk, idx) => (
                    <option key={idx} value={sk}>Seksi {idx+1}: {sk.replace("Seksi ", "")}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Status Awal
                  </label>
                  <select
                    value={prokerStatus}
                    onChange={(e) => setProkerStatus(e.target.value as OsisProker["status"])}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Estimasi Kas Anggaran (Rupiah)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 500000 (Isi 0 jika tanpa anggaran)"
                    value={prokerBudget}
                    onChange={(e) => setProkerBudget(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Target Sasaran Peserta
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Siswa Baru kelas X, Seluruh Kelas..."
                    value={prokerTarget}
                    onChange={(e) => setProkerTarget(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    Target Jendela Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Setiap Bulan, Triwulan I, Ramadan..."
                    value={prokerDate}
                    onChange={(e) => setProkerDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Deskripsi Cara Kerja &amp; Strategi Proker <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Gambarkan strategi, indikator keberhasilan, dan koordinasi seksi bidang..."
                  value={prokerDesc}
                  onChange={(e) => setProkerDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/65 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProkerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white cursor-pointer animate-none"
                >
                  Kirim Usulan Proker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODALS PANEL: SCAN QR SIMULATION */}
      {scannedEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 p-6 text-center shadow-2xl relative">
            <h3 className="text-md font-bold text-white mb-2">Simulasi Absensi QR Code</h3>
            <p className="text-xs text-slate-400">Posisikan kamera telepon siswa untuk scan barcode resmi kegiatan.</p>

            <div className="h-48 w-48 mx-auto my-6 bg-white p-3 rounded-2xl flex items-center justify-center border border-slate-300 relative overflow-hidden group">
              {/* Animated scanning line laser effect */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-rose-500 animate-[bounce_2s_infinite] shadow-lg shadow-rose-500"></div>
              
              {/* Fake QR SVG */}
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-slate-950">
                <path d="M5,5 h25 v10 h-15 v15 h-10 z" fill="currentColor" />
                <path d="M70,5 h25 v10 h-15 v15 h-10 z" fill="currentColor" transform="rotate(90 82.5 17.5)" />
                <path d="M5,70 h25 v10 h-15 v15 h-10 z" fill="currentColor" transform="rotate(270 17.5 82.5)" />
                <path d="M70,70 h25 v10 h-15 v15 h-10 z" fill="currentColor" transform="rotate(180 82.5 82.5)" />
                {/* QR Finder squares */}
                <rect x="15" y="15" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="4" />
                <rect x="22" y="22" width="6" height="6" fill="currentColor" />
                <rect x="65" y="15" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="4" />
                <rect x="72" y="22" width="6" height="6" fill="currentColor" />
                <rect x="15" y="65" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="4" />
                <rect x="22" y="72" width="6" height="6" fill="currentColor" />
                {/* Random QR bits */}
                <rect x="45" y="20" width="8" height="8" fill="currentColor" />
                <rect x="40" y="32" width="12" height="6" fill="currentColor" />
                <rect x="55" y="45" width="8" height="16" fill="currentColor" />
                <rect x="42" y="55" width="8" height="8" fill="currentColor" />
                <rect x="68" y="55" width="12" height="6" fill="currentColor" />
              </svg>
            </div>

            <p className="text-[10px] text-slate-500 font-mono italic">MENGHUBUNGKAN KE SERVER PRESENSI...</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setScannedEventId(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  onCheckAttendance(scannedEventId, currentUser.name);
                  setScannedEventId(null);
                  alert(`✓ ABSEN BERHASIL!\nKehadiran Anda pada agenda kegiatan telah dicatat oleh sistem dengan koordinat GPS valid.`);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Scan Barcode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODALS PANEL: CERTIFICATE VIEWER */}
      {certificateEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setCertificateEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black mb-1">
              PROUD PARTNERSHIP
            </span>
            <h3 className="text-lg font-bold text-slate-200">Klaim Sertifikat Partisipasi</h3>

            {/* Certificate Template Card */}
            <div className="w-full aspect-[4/3] max-w-lg mt-6 bg-slate-900 rounded-3xl border-4 border-double border-amber-500/40 p-8 flex flex-col justify-between text-center relative overflow-hidden select-none">
              {/* Background watermark logo styling */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                <svg viewBox="0 0 100 100" fill="none" className="w-64 h-64 text-amber-500">
                  <polygon points="50,10 90,80 10,80" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-amber-400 uppercase tracking-widest">
                  Sertifikat Penghargaan
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">SMK Negeri 1 Bandar • Organisasi Siswa Intra Sekolah</p>
              </div>

              <div className="space-y-2 my-auto">
                <p className="text-xs text-slate-400">Dengan hormat dianugerahkan kepada:</p>
                <p className="text-xl font-bold font-serif text-white tracking-wide underline decoration-amber-500/30">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Atas dedikasi, keikutsertaan, dan kontribusi nyata dalam menyukseskan kegiatan:
                  <br />
                  <strong className="text-amber-300">"{certificateEvent.title}"</strong>
                </p>
              </div>

              <div className="flex justify-between items-end border-t border-slate-800/80 pt-4 text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <p className="text-slate-500 uppercase">Ketua OSIS</p>
                  <p className="text-slate-200 font-bold font-serif">Zora Rizky Salsabila</p>
                  <p className="text-slate-600">NISN. 0087459312</p>
                </div>
                <div className="h-12 w-12 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs select-none">
                  OSIS
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-slate-500 uppercase">Pembina OSIS</p>
                  <p className="text-slate-200 font-bold font-serif">Janris Pandiangan, S.Kom</p>
                  <p className="text-slate-600">{currentYear}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCertificateEvent(null)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Sukses Mengunduh!\nSertifikat dalam format PDF beresolusi tinggi berhasil disimpan ke galeri lokal perangkat Anda.`);
                  setCertificateEvent(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                📥 Download PDF Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
