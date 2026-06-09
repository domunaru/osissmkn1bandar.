import React, { useState } from "react";
import { OSISMember, OsisPiketSchedule, OsisPiketTask } from "../types";
import {
  CalendarDays,
  Clock,
  UserPlus,
  Trash2,
  CheckSquare,
  Plus,
  User,
  ShieldAlert,
  ClipboardList,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Search,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PiketViewProps {
  piketSchedule: OsisPiketSchedule[];
  members: OSISMember[];
  isAdminOrPengurus: boolean;
  onUpdatePiketSchedule: (newSchedules: OsisPiketSchedule[]) => void;
  currentUser: { name: string; role: string };
}

export default function PiketView({
  piketSchedule,
  members,
  isAdminOrPengurus,
  onUpdatePiketSchedule,
  currentUser,
}: PiketViewProps) {
  // Mapping standard JS days to our schedule days
  // 1: Senin, 2: Selasa, 3: Rabu, 4: Kamis, 5: Jumat
  const getTodayDayIndonesian = (): "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" => {
    const dayIndex = new Date().getDay();
    switch (dayIndex) {
      case 1: return "Senin";
      case 2: return "Selasa";
      case 3: return "Rabu";
      case 4: return "Kamis";
      case 5: return "Jumat";
      default: return "Senin"; // default to Senin if weekend
    }
  };

  const todayDay = getTodayDayIndonesian();
  const [selectedDay, setSelectedDay] = useState<"Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat">(todayDay);

  // Search member to add to picket
  const [memberSearch, setMemberSearch] = useState("");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedSchedule = piketSchedule.find((s) => s.day === selectedDay) || {
    id: selectedDay,
    day: selectedDay,
    assignees: [],
    tasks: [],
    notes: "",
  };

  // Trigger brief alert feedback
  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  // Toggle checklist task completion
  const handleToggleTask = (taskId: string) => {
    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      }
      return s;
    });
    onUpdatePiketSchedule(updatedSchedules);
    showFeedback("Status tugas piket berhasil diperbarui!");
  };

  // Add custom task to day
  const handleAddPiketTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: OsisPiketTask = {
      id: "task_" + Date.now(),
      name: newTaskInput.trim(),
      completed: false,
    };

    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          tasks: [...(s.tasks || []), newTask],
        };
      }
      return s;
    });

    onUpdatePiketSchedule(updatedSchedules);
    setNewTaskInput("");
    showFeedback("Tugas piket baru berhasil ditambahkan!");
  };

  // Remove task
  const handleRemovePiketTask = (taskId: string) => {
    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          tasks: s.tasks.filter((t) => t.id !== taskId),
        };
      }
      return s;
    });
    onUpdatePiketSchedule(updatedSchedules);
    showFeedback("Tugas piket dihapus!");
  };

  // Assign member to day
  const handleAssignMember = (memberName: string) => {
    const isAlreadyAssigned = selectedSchedule.assignees.includes(memberName);
    if (isAlreadyAssigned) {
      alert("Pengurus tersebut sudah dijadwalkan piket pada hari ini!");
      return;
    }

    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          assignees: [...s.assignees, memberName],
        };
      }
      return s;
    });

    onUpdatePiketSchedule(updatedSchedules);
    setMemberSearch("");
    showFeedback(`Berhasil menjadwalkan ${memberName} piket hari ${selectedDay}!`);
  };

  // Unassign member
  const handleUnassignMember = (memberName: string) => {
    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          assignees: s.assignees.filter((name) => name !== memberName),
        };
      }
      return s;
    });

    onUpdatePiketSchedule(updatedSchedules);
    showFeedback(`${memberName} dikeluarkan dari piket hari ${selectedDay}.`);
  };

  // Save notes for today
  const handleSaveNotes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const notesStr = (data.get("piketNotes") as string) || "";

    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          notes: notesStr.trim(),
        };
      }
      return s;
    });

    onUpdatePiketSchedule(updatedSchedules);
    showFeedback("Log/Laporan harian piket berhasil disimpan!");
  };

  // Reset daily task status
  const handleResetTasks = () => {
    const updatedSchedules = piketSchedule.map((s) => {
      if (s.day === selectedDay) {
        return {
          ...s,
          tasks: s.tasks.map((t) => ({ ...t, completed: false })),
        };
      }
      return s;
    });
    onUpdatePiketSchedule(updatedSchedules);
    showFeedback("Semua tugas piket hari ini direset ke belum selesai.");
  };

  // Filter members lookup excluding already assigned
  const availableMembersFiltered = members.filter((m) => {
    if (m.role === "Pembina OSIS") return false; // Pembina dont picket
    const notAssigned = !selectedSchedule.assignees.includes(m.name);
    const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.role.toLowerCase().includes(memberSearch.toLowerCase());
    return notAssigned && matchesSearch;
  });

  const days: ("Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat")[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  // Helper to count completed tasks
  const totalTasksCount = selectedSchedule.tasks?.length || 0;
  const completedTasksCount = selectedSchedule.tasks?.filter((t) => t.completed).length || 0;

  return (
    <div className="space-y-6" id="osis-piket-container">
      {/* Title Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              Jadwal Piket Pengurus OSIS
            </h2>
            <p className="text-xs text-slate-400">Pengecekan disiplin siswa, kebersihan sekretariat, dan kontrol operasional OSIS harian.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-sky-50 text-sky-700 font-bold border border-sky-100 px-2 py-1 rounded-lg flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Hari Ini: {todayDay}
          </span>
          {isAdminOrPengurus && (
            <button
              onClick={handleResetTasks}
              className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-100 hover:border-blue-100 rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Reset Ceklist Tugas"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Tugas
            </button>
          )}
        </div>
      </div>

      {/* Floating Alerts Prompt */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-4 sm:right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800"
          >
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Selector Navigation Bar */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 shadow-inner">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDay === day;
          const sched = piketSchedule.find((s) => s.day === day);
          const assigneesCount = sched?.assignees?.length || 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer select-none ${
                isSelected
                  ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-100"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-1">
                {day}
                {isToday && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping inline-block" />}
              </span>
              <span className="text-[9px] text-slate-400 font-bold font-mono">
                {assigneesCount} Pengurus
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Layout for details & management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Assignees Roster & Checklist */}
        <div className="lg:col-span-2 space-y-6 lg:max-h-[calc(100vh-240px)] lg:overflow-y-auto pr-1">
          {/* Assigned Roster Cards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="h-4.5 w-4.5 text-blue-500" />
                Roster Petugas Piket Hari {selectedDay}
              </h3>
              <span className="text-[9px] font-mono font-black uppercase text-slate-400">
                Pukul 07.00 - 16.00 WIB
              </span>
            </div>

            {selectedSchedule.assignees.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-slate-150 border-dashed">
                <AlertCircle className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 italic">Belum ada pengurus OSIS dijadwalkan piket pada hari {selectedDay}.</p>
                {isAdminOrPengurus && (
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">Gunakan form di samping kanan untuk menyusun jadwal.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSchedule.assignees.map((name) => {
                  const mInfo = members.find((m) => m.name === name);
                  const roleLabel = mInfo?.role || "Anggota OSIS";
                  const sectionLabel = mInfo?.section || "Kepengurusan Inti";

                  return (
                    <div
                      key={name}
                      className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 uppercase select-none">
                          {name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-800 truncate leading-snug">{name}</h4>
                          <span className="text-[9.5px] text-slate-400 block truncate font-medium">{roleLabel}</span>
                          <span className="text-[8.5px] text-slate-400 block truncate text-blue-600 tracking-tight font-semibold mt-0.5">{sectionLabel}</span>
                        </div>
                      </div>

                      {isAdminOrPengurus && (
                        <button
                          type="button"
                          onClick={() => handleUnassignMember(name)}
                          className="p-1 px-1.5 text-rose-500 hover:text-white hover:bg-rose-600 border border-transparent rounded-lg transition-all cursor-pointer"
                          title="Hapus Roster"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Checklist Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-4.5 w-4.5 text-blue-500" />
                Ceklist Tugas Operasional ({completedTasksCount}/{totalTasksCount})
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                completedTasksCount === totalTasksCount && totalTasksCount > 0
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-slate-50 text-slate-500 border-slate-100"
              }`}>
                {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? "Lengkap ✓" : "Progres Piket"}
              </span>
            </div>

            {/* Task list view */}
            {(!selectedSchedule.tasks || selectedSchedule.tasks.length === 0) ? (
              <div className="text-center py-6 bg-slate-50/50 rounded-xl">
                <p className="text-xs text-slate-400 italic">Belum ada daftar tugas piket untuk hari {selectedDay}.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedSchedule.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors select-none cursor-pointer ${
                      task.completed
                        ? "bg-emerald-50/10 border-emerald-150 hover:bg-emerald-50/20"
                        : "bg-white border-slate-150 hover:bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                        task.completed ? "bg-emerald-500 border-transparent text-white" : "border-slate-300 bg-white"
                      }`}>
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-bold leading-normal truncate ${task.completed ? "line-through text-slate-400 font-medium" : "text-slate-700"}`}>
                        {task.name}
                      </span>
                    </div>

                    {isAdminOrPengurus && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePiketTask(task.id);
                        }}
                        className="p-1 hover:text-rose-600 transition-colors cursor-pointer text-slate-300"
                        title="Hapus tugas"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Task Input (Administrators only) */}
            {isAdminOrPengurus && (
              <form onSubmit={handleAddPiketTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  required
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Tambah tugas piket spesial hari ini..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shrink-0 uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Scheduler tools & logs */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-240px)] lg:overflow-y-auto pr-1">
          {/* Scheduler assign interface (Managers only) */}
          {isAdminOrPengurus ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
                <UserPlus className="h-4 w-4 text-blue-500" />
                Jadwalkan Piket Baru
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Cari Pengurus Untuk Hari <b>{selectedDay}</b>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Cari nama / jabatan..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl max-h-[180px] overflow-y-auto divide-y divide-slate-50 bg-slate-50/30">
                  {availableMembersFiltered.map((m) => (
                    <div
                      key={m.name}
                      onClick={() => handleAssignMember(m.name)}
                      className="p-2.5 hover:bg-white transition-colors cursor-pointer flex items-center justify-between text-xs font-bold text-slate-705 group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block truncate text-slate-800 font-extrabold group-hover:text-blue-600 transition-colors">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate font-medium">{m.role}</span>
                      </div>
                      <span className="shrink-0 text-[10px] bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 border border-transparent group-hover:border-blue-150/40 px-2 py-0.5 rounded-lg text-slate-500 transition-all font-black uppercase tracking-wider">
                        + Pilih
                      </span>
                    </div>
                  ))}

                  {availableMembersFiltered.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6 italic">Tidak ada pengurus yang ditemukan.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Non-administrative warning context */
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-slate-500 space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Akses Terbatas</h4>
              </div>
              <p className="text-[11px] leading-relaxed">
                Halaman penjadwalan roster & penentuan tugas operasional ini bersifat informatif untuk siswa. Hanya <b>Kepengurusan Inti (Admin/Pengurus)</b> yang memiliki wewenang mengedit penjadwalan.
              </p>
            </div>
          )}

          {/* Daily Report Log Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
              <FileText className="h-4 w-4 text-blue-500" />
              Laporan & Catatan Piket
            </h3>

            {isAdminOrPengurus ? (
              <form onSubmit={handleSaveNotes} className="space-y-3">
                <textarea
                  name="piketNotes"
                  rows={4}
                  defaultValue={selectedSchedule.notes || ""}
                  key={`${selectedDay}_notes`}
                  placeholder="Tuliskan laporan keadaan, kejadian khusus, barang temuan, atau koordinasi khusus untuk hari ini..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="h-4 w-4" />
                  Simpan Catatan {selectedDay}
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Laporan Petugas Piket:</span>
                {selectedSchedule.notes ? (
                  <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/40 text-xs text-slate-600 leading-relaxed font-semibold italic">
                    "{selectedSchedule.notes}"
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada catatan yang ditulis atau dilaporkan untuk hari {selectedDay}.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
