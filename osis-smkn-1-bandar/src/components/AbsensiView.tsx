import React, { useState } from "react";
import { OSISMember, MeetingAttendance } from "../types";
import {
  UserCheck,
  Calendar,
  Search,
  Trash2,
  Users,
  Clock,
  Plus,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  CalendarDays,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AbsensiViewProps {
  attendance: MeetingAttendance[];
  members: OSISMember[];
  isAdmin: boolean;
  isAdminOrPengurus: boolean;
  onSaveAttendance: (
    meetingTitle: string,
    absensi: { memberName: string; role: string; status: "Hadir" | "Izin" | "Sakit" | "Alfa"; timeIn: string }[]
  ) => void;
  onDeleteAttendance: (id: string) => void;
  currentUser: { name: string; role: string };
}

export default function AbsensiView({
  attendance,
  members,
  isAdmin,
  isAdminOrPengurus,
  onSaveAttendance,
  onDeleteAttendance,
  currentUser,
}: AbsensiViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  
  // Single simple state for attendance: key is memberName, value is "Hadir" | "Izin" | "Sakit" | "Alfa"
  const [absensiState, setAbsensiState] = useState<Record<string, "Hadir" | "Izin" | "Sakit" | "Alfa">>({});
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  // Search and section filters for taking or viewing
  const [memberSearch, setMemberSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("Semua");
  const [historySearch, setHistorySearch] = useState("");

  const initAttendanceState = () => {
    const fresh: Record<string, "Hadir" | "Izin" | "Sakit" | "Alfa"> = {};
    members.forEach((m) => {
      fresh[m.name] = "Hadir"; // default everything to Hadir (checked)
    });
    setAbsensiState(fresh);
  };

  const handleStartSession = () => {
    initAttendanceState();
    setMeetingTitle("");
    setShowAddForm(true);
  };

  // Toggle present/absent helper
  const handleTogglePresent = (name: string) => {
    const current = absensiState[name] || "Hadir";
    setAbsensiState({
      ...absensiState,
      [name]: current === "Hadir" ? "Alfa" : "Hadir",
    });
  };

  // Custom cycle or specific state setting
  const handleChangeStatus = (name: string, status: "Hadir" | "Izin" | "Sakit" | "Alfa") => {
    setAbsensiState({
      ...absensiState,
      [name]: status,
    });
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      alert("Silakan isi nama agenda atau rapat terlebih dahulu.");
      return;
    }

    const records = members.map((m) => {
      const status = absensiState[m.name] || "Hadir";
      return {
        memberName: m.name,
        role: m.role,
        status,
        timeIn: status === "Hadir" ? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"
      };
    });

    onSaveAttendance(meetingTitle, records);
    setShowAddForm(false);
    setMeetingTitle("");
  };

  // Sections list for filtering
  const sections = ["Semua", ...Array.from(new Set(members.map((m) => m.section).filter(Boolean))) as string[]];

  // Filters members for taking attendance
  const filteredMembersTake = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.role.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesSection = sectionFilter === "Semua" || m.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  // Simple statistics
  const totalSessions = attendance.length;
  const totalMarks = attendance.reduce((sum, s) => sum + s.absensiList.length, 0);
  const totalHadirMarks = attendance.reduce((sum, s) => sum + s.absensiList.filter(a => a.status === "Hadir").length, 0);
  const averageAttendanceRate = totalMarks > 0 ? Math.round((totalHadirMarks / totalMarks) * 100) : 100;

  const filteredSessions = attendance.filter((session) => {
    return session.meetingTitle.toLowerCase().includes(historySearch.toLowerCase());
  });

  return (
    <div className="space-y-6" id="osis-absensi-container">
      {/* Sleek Minimalist Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">Presensi Pengurus OSIS</h2>
            <p className="text-xs text-slate-400">Jurnal absensi meeting, rapat kerja, dan kepanitiaan harian.</p>
          </div>
        </div>

        {isAdminOrPengurus && (
          <div className="shrink-0">
            {!showAddForm ? (
              <button
                type="button"
                onClick={handleStartSession}
                className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-150 uppercase tracking-wider"
              >
                <Plus className="h-4 w-4" />
                Buat Absen Baru
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {showAddForm && isAdminOrPengurus ? (
            /* SIMPLE FORM TAKE ATTENDANCE */
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4"
            >
              <div className="border-b border-slate-50 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">Entri Lembar Presensi</span>
                  <p className="text-xs text-slate-505 font-bold">Tekan foto/bintang anggota untuk mengubah status Kehadiran.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...absensiState };
                      members.forEach((m) => { updated[m.name] = "Hadir"; });
                      setAbsensiState(updated);
                    }}
                    className="px-2.5 py-1 text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 rounded-lg font-bold border border-emerald-100 transition-all cursor-pointer"
                  >
                    ✓ Hadirkan Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...absensiState };
                      members.forEach((m) => { updated[m.name] = "Alfa"; });
                      setAbsensiState(updated);
                    }}
                    className="px-2.5 py-1 text-[10px] bg-rose-50 text-rose-700 hover:bg-rose-100/50 rounded-lg font-bold border border-rose-100 transition-all cursor-pointer"
                  >
                    Kosongkan Semua
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitAttendance} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1">
                      Nama Kegiatan / Agenda Pertemuan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="e.g. Rapat Koordinasi Program Kerja"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-550"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="text"
                      disabled
                      value={new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/65 px-3 py-2 text-xs text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Micro search filter */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Cari anggota OSIS..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs shrink-0">
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <select
                      value={sectionFilter}
                      onChange={(e) => setSectionFilter(e.target.value)}
                      className="bg-slate-50/50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer focus:outline-none focus:bg-white"
                    >
                      {sections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CLEAN SIMPLIFIED MEMBERS CHECKLIST GRID */}
                <div className="bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {filteredMembersTake.map((member) => {
                      const status = absensiState[member.name] || "Hadir";
                      const isPresent = status === "Hadir";

                      // Styling depending on state
                      let cardStyle = "border-slate-100 bg-white hover:border-slate-220";
                      let indicatorStyle = "bg-slate-100 text-slate-400";
                      if (status === "Hadir") {
                        cardStyle = "border-emerald-250 bg-emerald-50/15 ring-2 ring-emerald-500/5";
                        indicatorStyle = "bg-emerald-500 text-white";
                      } else if (status === "Izin") {
                        cardStyle = "border-blue-200 bg-blue-50/10";
                        indicatorStyle = "bg-blue-500 text-white";
                      } else if (status === "Sakit") {
                        cardStyle = "border-amber-200 bg-amber-50/10";
                        indicatorStyle = "bg-amber-500 text-white";
                      } else if (status === "Alfa") {
                        cardStyle = "border-rose-220 bg-rose-50/10";
                        indicatorStyle = "bg-rose-500 text-white";
                      }

                      return (
                        <div
                          key={member.name}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all duration-150 ${cardStyle}`}
                        >
                          {/* Member details inside small card */}
                          <div 
                            onClick={() => handleTogglePresent(member.name)}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none"
                          >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 select-none ${indicatorStyle}`}>
                              {status === "Hadir" ? <Check className="h-4.5 w-4.5" /> : member.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-slate-800 text-xs truncate leading-snug">{member.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{member.role}</p>
                            </div>
                          </div>

                          {/* Quick multi-click toggles / status select dropdown */}
                          <div className="shrink-0 flex items-center gap-1.5">
                            <select
                              value={status}
                              onChange={(e) => handleChangeStatus(member.name, e.target.value as any)}
                              className={`text-[10px] font-black uppercase tracking-wider border rounded-lg p-1.5 cursor-pointer focus:outline-none ${
                                status === "Hadir"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : status === "Izin"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : status === "Sakit"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-rose-50 text-rose-700 border-rose-105"
                              }`}
                            >
                              <option value="Hadir">Hadir</option>
                              <option value="Izin">Izin</option>
                              <option value="Sakit">Sakit</option>
                              <option value="Alfa">Alfa</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}

                    {filteredMembersTake.length === 0 && (
                      <div className="col-span-full text-center py-10 bg-white rounded-xl">
                        <p className="text-xs text-slate-400 italic">Anggota OSIS tidak ditemukan</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer simple submit */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all shadow-md uppercase tracking-wider"
                  >
                    Simpan Presensi
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* SIMPLE VIEW HISTORY LIST */
            <motion.div
              key="history-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Core stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Pertemuan</span>
                  <span className="text-xl font-black text-slate-800 tracking-tight block mt-0.5">{totalSessions} Rapat</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Rata-rata Hadir</span>
                  <span className="text-xl font-black text-emerald-600 tracking-tight block mt-0.5">{averageAttendanceRate}% Keaktifan</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs col-span-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[11px] text-slate-405 leading-relaxed font-medium">
                    Siswa tidak hadir berstatus <b className="text-rose-500 font-extrabold">Alfa</b>, <b className="text-blue-500 font-extrabold">Izin</b>, atau <b className="text-amber-500 font-extrabold">Sakit</b> direkam ke dalam rekap jurnalisme keaktifan OSIS.
                  </p>
                </div>
              </div>

              {/* Saved sessions lists */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <CalendarDays className="h-4.5 w-4.5 text-blue-500" />
                      Arsip Lembar Absensi OSIS ({filteredSessions.length})
                    </h3>
                  </div>

                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Cari pertemuan..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Sessions stack */}
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic">Belum ada rekaman absen rapat tersimpan.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSessions.map((session) => {
                      const sList = session.absensiList || [];
                      const presentCount = sList.filter(a => a.status === "Hadir").length;
                      const isExpanded = expandedSession === session.id;

                      return (
                        <div
                          key={session.id}
                          className="border border-slate-100 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/10 hover:border-slate-200 transition-all duration-150 bg-white"
                        >
                          {/* Heading brief toggler */}
                          <div
                            onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                            className="p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer hover:bg-slate-50/40 select-none"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="p-1 px-1.5 bg-blue-50 text-blue-600 rounded-md font-black text-[10px] tracking-tight">
                                {presentCount} / {sList.length} Hadir
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-extrabold text-slate-800 text-xs truncate leading-normal">
                                  "{session.meetingTitle}"
                                </h4>
                                <span className="text-[10px] text-slate-400 font-medium block">
                                  Diposting pada {session.date}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              {/* Summary compact list chips */}
                              <div className="flex items-center gap-1 text-[9px] font-bold font-mono uppercase">
                                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">H:{sList.filter(x => x.status === "Hadir").length}</span>
                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">I:{sList.filter(x => x.status === "Izin").length}</span>
                                <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">S:{sList.filter(x => x.status === "Sakit").length}</span>
                                <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">A:{sList.filter(x => x.status === "Alfa").length}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
                                  {isExpanded ? "Tutup" : "Buka Detail"}
                                </span>
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}

                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const confirmDel = window.confirm(
                                        `Hapus lembar absen agenda "${session.meetingTitle}"?`
                                      );
                                      if (confirmDel) {
                                        onDeleteAttendance(session.id);
                                      }
                                    }}
                                    className="p-1 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-all border border-rose-100 hover:border-transparent cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Simple Table */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden border-t border-slate-50 bg-slate-50/50"
                              >
                                <div className="p-3.5 space-y-2 max-h-60 overflow-y-auto">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {sList.map((log) => {
                                      let logColor = "bg-white text-slate-705 border-slate-100";
                                      let label = "Hadir";
                                      if (log.status === "Hadir") {
                                        logColor = "bg-emerald-50/65 text-emerald-800 border-emerald-100/50";
                                        label = "✓ Hadir (" + (log.timeIn || "-") + ")";
                                      } else if (log.status === "Izin") {
                                        logColor = "bg-blue-50/65 text-blue-800 border-blue-100/50";
                                        label = "ℹ Izin";
                                      } else if (log.status === "Sakit") {
                                        logColor = "bg-amber-50/65 text-amber-850 border-amber-100/50";
                                        label = "⛑ Sakit";
                                      } else {
                                        logColor = "bg-rose-50/65 text-rose-800 border-rose-100/50";
                                        label = "✗ Alfa";
                                      }

                                      return (
                                        <div key={log.memberName} className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 ${logColor}`}>
                                          <div className="min-w-0">
                                            <span className="font-extrabold block truncate leading-tight">{log.memberName}</span>
                                            <span className="text-[9px] text-slate-400 block truncate">{log.role}</span>
                                          </div>
                                          <span className="text-[10px] font-black uppercase shrink-0">
                                            {label}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
