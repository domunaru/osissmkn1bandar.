import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  OSISMember,
  AuditLog,
  Announcement,
  OsisEvent,
  MeetingAttendance,
  StudentAspiration,
  DigitalVote,
  FinancialRecord,
  MeetingMinute,
  OsisPiketSchedule,
  OsisProker,
} from "./types";
import { INITIAL_MEMBERS } from "./data/osisMembers";
import { INITIAL_NEWS } from "./components/BeritaView";
import { INITIAL_ANNOUNCEMENTS, INITIAL_EVENTS, INITIAL_FINANCES, INITIAL_MINUTES, INITIAL_PIKET, INITIAL_PROKERS } from "./data/osisInitialData";
import Login from "./components/Login";
import DashboardView from "./components/DashboardView";
import PengumumanView from "./components/PengumumanView";
import KegiatanView from "./components/KegiatanView";
import AspirasiView from "./components/AspirasiView";
import VotingView from "./components/VotingView";
import KeuanganView from "./components/KeuanganView";
import NotulensiView from "./components/NotulensiView";
import BeritaView from "./components/BeritaView";
import GaleriView from "./components/GaleriView";
import StrukturView from "./components/StrukturView";
import AdminPanel from "./components/AdminPanel";
import AbsensiView from "./components/AbsensiView";
import PiketView from "./components/PiketView";
import osisLogo from "./assets/images/logo_osis.png";

import {
  School,
  LayoutDashboard,
  Megaphone,
  Calendar,
  HandHelping,
  Vote,
  Landmark,
  FileText,
  BookMarked,
  Images,
  Users,
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  X,
  Plus,
  Compass,
  UserCheck
} from "lucide-react";

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<{ name: string; role: "Admin" | "Pengurus" | "Siswa" } | null>(null);
  const [activeMember, setActiveMember] = useState<OSISMember | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  // Database States (loaded from localStorage on boot)
  const [members, setMembers] = useState<OSISMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<OsisEvent[]>([]);
  const [attendance, setAttendance] = useState<MeetingAttendance[]>([]);
  const [piketSchedule, setPiketSchedule] = useState<OsisPiketSchedule[]>([]);
  const [aspirations, setAspirations] = useState<StudentAspiration[]>([]);
  const [votes, setVotes] = useState<DigitalVote[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [prokers, setProkers] = useState<OsisProker[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Search filter
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchToken, setGlobalSearchToken] = useState("");

  // Notification highlights
  const [notifications, setNotifications] = useState<string[]>([
    "Sesi Rapat Bulanan OSIS baru telah diumumkan",
    "Pendaftaran Futsal Cup Resmi dibuka",
    "Ketua OSIS Zora memublikasikan Laporan Kas Keuangan"
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Setup initial persistent values if mock db is uninitialized
  useEffect(() => {
    // 1. Members
    const savedMembers = localStorage.getItem("osis_members_v2");
    let initialM = INITIAL_MEMBERS;
    if (savedMembers) {
      initialM = JSON.parse(savedMembers);
      setMembers(initialM);
    } else {
      localStorage.setItem("osis_members_v2", JSON.stringify(INITIAL_MEMBERS));
      setMembers(INITIAL_MEMBERS);
    }

    // 2. Announcements
    const savedAnn = localStorage.getItem("osis_announcements");
    if (savedAnn) {
      setAnnouncements(JSON.parse(savedAnn));
    } else {
      localStorage.setItem("osis_announcements", JSON.stringify(INITIAL_ANNOUNCEMENTS));
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
    }

    // 3. Events
    const savedEvents = localStorage.getItem("osis_events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      localStorage.setItem("osis_events", JSON.stringify(INITIAL_EVENTS));
      setEvents(INITIAL_EVENTS);
    }

    // 3.5 Attendance
    const savedAttendance = localStorage.getItem("osis_attendance_history");
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    } else {
      localStorage.setItem("osis_attendance_history", JSON.stringify([]));
      setAttendance([]);
    }

    // 3.6 Piket OSIS
    const savedPiket = localStorage.getItem("osis_piket");
    if (savedPiket) {
      setPiketSchedule(JSON.parse(savedPiket));
    } else {
      localStorage.setItem("osis_piket", JSON.stringify(INITIAL_PIKET));
      setPiketSchedule(INITIAL_PIKET);
    }

    // 4. Aspirations
    const savedAsp = localStorage.getItem("osis_aspirations");
    if (savedAsp) {
      setAspirations(JSON.parse(savedAsp));
    } else {
      localStorage.setItem("osis_aspirations", JSON.stringify([]));
      setAspirations([]);
    }

    // 5. Hard Voting Sesi
    const savedVotes = localStorage.getItem("osis_votes");
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    } else {
      localStorage.setItem("osis_votes", JSON.stringify([]));
      setVotes([]);
    }

    // 6. Finances (Kas)
    const hasResetFin = localStorage.getItem("osis_finances_reset_v3");
    if (!hasResetFin) {
      localStorage.setItem("osis_finances", JSON.stringify([]));
      localStorage.setItem("osis_finances_reset_v3", "true");
      setFinances([]);
    } else {
      const savedFinances = localStorage.getItem("osis_finances");
      if (savedFinances) {
        setFinances(JSON.parse(savedFinances));
      } else {
        localStorage.setItem("osis_finances", JSON.stringify([]));
        setFinances([]);
      }
    }

    // 7. Audit Logs
    const savedLogs = localStorage.getItem("osis_logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      localStorage.setItem("osis_logs", JSON.stringify([]));
      setLogs([]);
    }

    // 7.5 Meeting Minutes (Notulensi)
    const savedMinutes = localStorage.getItem("osis_minutes");
    if (savedMinutes) {
      setMinutes(JSON.parse(savedMinutes));
    } else {
      localStorage.setItem("osis_minutes", JSON.stringify(INITIAL_MINUTES));
      setMinutes(INITIAL_MINUTES);
    }

    // 7.6 Program Kerja Sekbid (Proker)
    const savedProkers = localStorage.getItem("osis_prokers_v3");
    if (savedProkers) {
      setProkers(JSON.parse(savedProkers));
    } else {
      localStorage.setItem("osis_prokers_v3", JSON.stringify(INITIAL_PROKERS));
      setProkers(INITIAL_PROKERS);
    }

    // 8. Session recovery
    const savedAuth = localStorage.getItem("osis_auth");
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setCurrentUser(data.currentUser);
      setActiveMember(data.activeMember);
    }
  }, []);

  const triggerAuditLog = (action: string, userOverride?: string, roleOverride?: string) => {
    const freshLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: userOverride || currentUser?.name || "Siswa",
      role: roleOverride || currentUser?.role || "Siswa",
      action: action
    };

    const nextLogs = [freshLog, ...logs];
    setLogs(nextLogs);
    localStorage.setItem("osis_logs", JSON.stringify(nextLogs));
  };

  const handleLoginSuccess = (name: string, role: "Admin" | "Pengurus" | "Siswa", member?: OSISMember) => {
    const userSession = { name, role };
    setCurrentUser(userSession);
    setActiveMember(member);
    localStorage.setItem("osis_auth", JSON.stringify({ currentUser: userSession, activeMember: member }));
    triggerAuditLog(`Berhasil melakukan autentikasi login ke portal OSIS.`, name, role);
    // Auto show toast success
    const alertMsg = `Akses Diberikan: Selamat Datang di portal OSIS, ${name} (${role})`;
    setNotifications((prev) => [alertMsg, ...prev]);
  };

  const handleLogout = () => {
    if (currentUser) {
      triggerAuditLog(`Melakukan keluar (logout) dari sesi portal OSIS.`);
    }
    setCurrentUser(null);
    setActiveMember(undefined);
    localStorage.removeItem("osis_auth");
  };

  // State update callbacks to enable full updates across files with persistence
  const handleAddAnnouncement = (item: Omit<Announcement, "id" | "date">) => {
    const fresh: Announcement = {
      ...item,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
    };
    const updated = [fresh, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("osis_announcements", JSON.stringify(updated));
    triggerAuditLog(`Membuat pengumuman baru berjudul "${item.title}"`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("osis_announcements", JSON.stringify(updated));
    triggerAuditLog(`Menghapus pengumuman ID: ${id}`);
  };

  const handleAddEvent = (item: Omit<OsisEvent, "id" | "registeredUsers">) => {
    const fresh: OsisEvent = {
      ...item,
      id: `ev-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      registeredUsers: [],
    };
    const updated = [fresh, ...events];
    setEvents(updated);
    localStorage.setItem("osis_events", JSON.stringify(updated));
    triggerAuditLog(`Menambahkan kegiatan baru: "${item.title}"`);
  };

  const handleRegisterEvent = (eventId: string, userName: string) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        if (ev.registeredUsers.includes(userName)) return ev;
        return { ...ev, registeredUsers: [...ev.registeredUsers, userName] };
      }
      return ev;
    });
    setEvents(updated);
    localStorage.setItem("osis_events", JSON.stringify(updated));
    triggerAuditLog(`Mendaftarkan diri mengikuti kegiatan ID: ${eventId}`);
  };

  const handleCheckAttendance = (eventId: string, userName: string) => {
    // Add physical indicator / register
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        if (!ev.registeredUsers.includes(userName)) {
          return { ...ev, registeredUsers: [...ev.registeredUsers, userName] };
        }
      }
      return ev;
    });
    setEvents(updated);
    localStorage.setItem("osis_events", JSON.stringify(updated));
    triggerAuditLog(`Melakukan absensi mandiri QR Code untuk event ID: ${eventId}`);
  };

  const handleAddAspiration = (item: Omit<StudentAspiration, "id" | "date" | "status" | "upvotes">) => {
    const fresh: StudentAspiration = {
      ...item,
      id: `asp-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      status: "Baru",
      upvotes: 0,
    };
    const updated = [fresh, ...aspirations];
    setAspirations(updated);
    localStorage.setItem("osis_aspirations", JSON.stringify(updated));
    triggerAuditLog(`Mengajukan aspirasi siswa murni kategori: ${item.category}`);
  };

  const handleRespondAspiration = (id: string, response: string) => {
    const updated = aspirations.map((asp) => {
      if (asp.id === id) {
        return { ...asp, status: "Selesai" as const, adminResponse: response };
      }
      return asp;
    });
    setAspirations(updated);
    localStorage.setItem("osis_aspirations", JSON.stringify(updated));
    triggerAuditLog(`Menjawab/menanggapi aspirasi ID: ${id}`);
  };

  const handleUpvoteAspiration = (id: string) => {
    const updated = aspirations.map((asp) => {
      if (asp.id === id) {
        return { ...asp, upvotes: asp.upvotes + 1 };
      }
      return asp;
    });
    setAspirations(updated);
    localStorage.setItem("osis_aspirations", JSON.stringify(updated));
  };

  const handleCastVote = (voteId: string, candidateId: string, userName: string) => {
    const updated = votes.map((vt) => {
      if (vt.id === voteId) {
        if (vt.votedUserIds.includes(userName)) return vt;
        const freshCandidates = vt.candidates.map((cand) => {
          if (cand.id === candidateId) {
            return { ...cand, votes: cand.votes + 1 };
          }
          return cand;
        });
        return {
          ...vt,
          candidates: freshCandidates,
          votedUserIds: [...vt.votedUserIds, userName],
        };
      }
      return vt;
    });
    setVotes(updated);
    localStorage.setItem("osis_votes", JSON.stringify(updated));
    triggerAuditLog(`Menyumbang suara elektabilitas di jajak pendapat ID: ${voteId}`);
  };

  const handleAddVote = (title: string, description: string, candidates: string[]) => {
    const mapped = candidates.map((name, i) => ({
      id: `cand-${Date.now()}-${i}`,
      name,
      vision: "Kandidat Terpilih",
      mission: "Turut berdedikasi memajukan sekolah.",
      votes: 0,
    }));

    const fresh: DigitalVote = {
      id: `vote-${Date.now()}`,
      title,
      description,
      candidates: mapped,
      isActive: true,
      votedUserIds: [],
    };
    const updated = [fresh, ...votes];
    setVotes(updated);
    localStorage.setItem("osis_votes", JSON.stringify(updated));
    triggerAuditLog(`Meluncurkan sesi pendaftaran voting baru berjudul "${title}"`);
  };

  const handleAddTransaction = (item: Omit<FinancialRecord, "id" | "date" | "reportedBy">) => {
    const fresh: FinancialRecord = {
      ...item,
      id: `fin-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      reportedBy: currentUser?.name || "Laura Garneta Simamora",
    };
    const updated = [fresh, ...finances];
    setFinances(updated);
    localStorage.setItem("osis_finances", JSON.stringify(updated));
    triggerAuditLog(`Mencatat laporan sirkulasi kas ${item.type} sebesar ${item.amount}`);
  };

  const handleResetFinances = () => {
    setFinances([]);
    localStorage.setItem("osis_finances", JSON.stringify([]));
    triggerAuditLog(`Mereset saldo kas OSIS & mengosongkan histori transaksi keuangan.`);
  };

  const handleSaveAttendance = (
    meetingName: string,
    records: { memberName: string; role: string; status: "Hadir" | "Izin" | "Sakit" | "Alfa"; timeIn: string }[]
  ) => {
    const fresh: MeetingAttendance = {
      id: `att-${Date.now()}`,
      meetingTitle: meetingName,
      date: new Date().toISOString().substring(0, 10),
      absensiList: records,
    };
    const updated = [fresh, ...attendance];
    setAttendance(updated);
    localStorage.setItem("osis_attendance_history", JSON.stringify(updated));
    triggerAuditLog(`Menyelesaikan dan menandatangani jurnal absensi rapat "${meetingName}"`);
  };

  const handleDeleteAttendance = (id: string) => {
    const target = attendance.find((a) => a.id === id);
    const updated = attendance.filter((a) => a.id !== id);
    setAttendance(updated);
    localStorage.setItem("osis_attendance_history", JSON.stringify(updated));
    if (target) {
      triggerAuditLog(`Menghapus lembar jurnal absensi rapat "${target.meetingTitle}"`);
    } else {
      triggerAuditLog(`Menghapus lembar jurnal absensi`);
    }
  };

  const handleUpdatePiketSchedule = (newSchedules: OsisPiketSchedule[]) => {
    setPiketSchedule(newSchedules);
    localStorage.setItem("osis_piket", JSON.stringify(newSchedules));
    triggerAuditLog(`Memperbarui roster/tugas jadwal piket mingguan OSIS`);
  };

  const handleAddProker = (item: Omit<OsisProker, "id">) => {
    const newProker: OsisProker = {
      ...item,
      id: `proker-${Date.now()}`
    };
    const updated = [newProker, ...prokers];
    setProkers(updated);
    localStorage.setItem("osis_prokers_v3", JSON.stringify(updated));
    triggerAuditLog(`Menambahkan Program Kerja baru: "${item.title}" (${item.sekbid})`);
  };

  const handleUpdateProkerStatus = (prokerId: string, status: OsisProker["status"]) => {
    const updated = prokers.map((p) => p.id === prokerId ? { ...p, status } : p);
    setProkers(updated);
    localStorage.setItem("osis_prokers_v3", JSON.stringify(updated));
    
    const changed = prokers.find((p) => p.id === prokerId);
    if (changed) {
      triggerAuditLog(`Mengubah status Program Kerja "${changed.title}" menjadi ${status}`);
    }
  };

  const handleAddMember = (member: OSISMember) => {
    const updated = [...members, member];
    setMembers(updated);
    localStorage.setItem("osis_members_v2", JSON.stringify(updated));
    triggerAuditLog(`Mendaftarkan pengurus baru bernama "${member.name}"`);
  };

  const handleAddMinute = (item: Omit<MeetingMinute, "id">) => {
    const fresh: MeetingMinute = {
      ...item,
      id: `min-${Date.now()}`,
    };
    const updated = [fresh, ...minutes];
    setMinutes(updated);
    localStorage.setItem("osis_minutes", JSON.stringify(updated));
    triggerAuditLog(`Menulis risalah notulensi rapat baru: "${item.title}"`);
  };

  const handleDeleteMinute = (id: string) => {
    const updated = minutes.filter((m) => m.id !== id);
    setMinutes(updated);
    localStorage.setItem("osis_minutes", JSON.stringify(updated));
    triggerAuditLog(`Menghapus risalah notulensi rapat ID: ${id}`);
  };

  // Systems Backup Download helper
  const handleDownloadBackup = () => {
    const backupObj = {
      members,
      announcements,
      events,
      attendance,
      aspirations,
      votes,
      finances,
      minutes,
      prokers,
      logs,
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Backup_Full_Database_OSIS_SMKN1Bandar.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAuditLog(`Melakukan download backup piringan database penuh.`);
    alert("✓ CADANGAN DATABASE DIUNDUH!\nSemua records tersimpan aman dalam file .json.");
  };

  const handleResetAllData = () => {
    const confirmReset = window.confirm(
      "⚠ PERINGATAN PENTING ⚠\n\nApakah Anda yakin ingin menghapus dan MERESET semua data kegiatan, keuangan kas, absensi rapat, log, aspirasi siswa, voting, dan pengumuman OSIS?\n\nTindakan ini bersifat permanen dan tidak dapat dibatalkan!"
    );
    if (!confirmReset) return;

    // Reset React state arrays to initial mock lists to preserve visual layout
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEvents(INITIAL_EVENTS);
    setAspirations([]);
    setVotes([]);
    setFinances(INITIAL_FINANCES);
    setAttendance([]);
    setPiketSchedule(INITIAL_PIKET);
    setMinutes(INITIAL_MINUTES);
    setProkers(INITIAL_PROKERS);
    setCurrentUser(null);
    setActiveMember(undefined);

    // Update with brand new minimal logger
    const freshLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: currentUser?.name || "Moderator",
      role: "Admin",
      action: "Database OSIS direset penuh ke kondisi awal (Clean & Fresh Mock State)."
    };
    setLogs([freshLog]);

    // Clear local storage keys but write back default lists
    localStorage.setItem("osis_announcements", JSON.stringify(INITIAL_ANNOUNCEMENTS));
    localStorage.setItem("osis_events", JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem("osis_aspirations", JSON.stringify([]));
    localStorage.setItem("osis_votes", JSON.stringify([]));
    localStorage.setItem("osis_finances", JSON.stringify(INITIAL_FINANCES));
    localStorage.setItem("osis_attendance_history", JSON.stringify([]));
    localStorage.setItem("osis_piket", JSON.stringify(INITIAL_PIKET));
    localStorage.setItem("osis_minutes", JSON.stringify(INITIAL_MINUTES));
    localStorage.setItem("osis_prokers_v3", JSON.stringify(INITIAL_PROKERS));
    localStorage.setItem("osis_logs", JSON.stringify([freshLog]));
    localStorage.removeItem("osis_auth"); // logout the user to reflect clean state

    alert("✓ SEMUA BASIS DATA KEGIATAN & KEUANGAN TELAH BERHASIL DIRESET!\n\nHalaman akan memuat ulang login.");
    window.location.reload();
  };

  const handleRestoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.aspirations) setAspirations(parsed.aspirations);
        if (parsed.votes) setVotes(parsed.votes);
        if (parsed.finances) setFinances(parsed.finances);
        if (parsed.minutes) setMinutes(parsed.minutes);
        if (parsed.prokers) setProkers(parsed.prokers);
        if (parsed.logs) setLogs(parsed.logs);

        // Save local
        localStorage.setItem("osis_members_v2", JSON.stringify(parsed.members || []));
        localStorage.setItem("osis_announcements", JSON.stringify(parsed.announcements || []));
        localStorage.setItem("osis_events", JSON.stringify(parsed.events || []));
        localStorage.setItem("osis_aspirations", JSON.stringify(parsed.aspirations || []));
        localStorage.setItem("osis_votes", JSON.stringify(parsed.votes || []));
        localStorage.setItem("osis_finances", JSON.stringify(parsed.finances || []));
        localStorage.setItem("osis_minutes", JSON.stringify(parsed.minutes || []));
        localStorage.setItem("osis_prokers_v3", JSON.stringify(parsed.prokers || []));
        localStorage.setItem("osis_logs", JSON.stringify(parsed.logs || []));

        triggerAuditLog(`Memulihkan (restore) piringan database dari berkas eksternal.`);
        alert("✓ PEMULIHAN DATABASE SUKSES!\nBasis data kini selaras dengan berkas cadangan.");
      } catch (err) {
        alert("Gagal memulihkan cadangan: Format berkas `.json` tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  // Render based on Authentication status
  if (!currentUser) {
    if (showLoginScreen) {
      return (
        <Login
          onLoginSuccess={(name, role, member) => {
            handleLoginSuccess(name, role, member);
            setShowLoginScreen(false);
          }}
          onBackToHome={() => setShowLoginScreen(false)}
        />
      );
    }

    return (
      <div className="flex h-screen flex-col bg-slate-50 font-sans overflow-hidden">
        {/* Public Header bar (Light Mode) */}
        <header className="h-16 border-b border-slate-200 bg-white/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 overflow-hidden">
              <img src={osisLogo} alt="Logo OSIS" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="font-extrabold text-xs tracking-wider text-slate-800 font-sans leading-tight">
                SMKN 1 BANDAR
              </h1>
              <p className="text-[9.5px] font-bold text-slate-400 tracking-widest font-mono">
                INFORMASI PUBLIK &amp; BERANDA OSIS
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowLoginScreen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Compass className="h-4 w-4 animate-[spin_5s_linear_infinite] hidden sm:block" />
              <span>Masuk Portal OSIS</span>
            </button>
          </div>
        </header>

        {/* Public Landing scroll container (Light Mode) */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden bg-[#f8fafc] p-4 sm:p-6 md:p-8 lg:max-h-[calc(100vh-64px)] flex flex-col">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full lg:h-full lg:min-h-0">
            
            {/* Left Column: Welcome and Reports */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:h-full lg:overflow-y-auto pr-1">
              <DashboardView
                announcements={announcements}
                events={events}
                finances={finances}
                onNavigate={() => setShowLoginScreen(true)}
                currentUser={null}
                onAddAspiration={handleAddAspiration}
                aspirations={aspirations}
                onUpvoteAspiration={handleUpvoteAspiration}
              />
            </div>

            {/* Right Column: Structure Section (Side-by-Side on Desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-4 lg:h-full lg:overflow-y-auto pr-1">
              <div className="text-center lg:text-left space-y-1 pb-3 border-b border-slate-100">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200/60 uppercase tracking-widest inline-block">
                  Struktur Kepengurusan
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Pengurus BPH &amp; Koordinator
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Bagan kepengurusan masa bakti 2026/2027.
                </p>
              </div>
              
              <div>
                <StrukturView isSidebar={true} />
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  const isAdmin = currentUser.role === "Admin";
  const isPengurus = currentUser.role === "Pengurus";
  const isAdminOrPengurus = isAdmin || isPengurus;

  // Filter items matching globalSearchToken if search widget is active
  const searchResults = (() => {
    if (!globalSearchToken.trim()) return [];
    const t = globalSearchToken.toLowerCase();
    const list: { title: string; category: string; description: string; tab: string }[] = [];

    // Search Announcements
    announcements.forEach((ann) => {
      if (ann.title.toLowerCase().includes(t) || ann.content.toLowerCase().includes(t)) {
        list.push({ title: ann.title, category: `Pengumuman (${ann.category})`, description: ann.content, tab: "Pengumuman" });
      }
    });

    // Search Events
    events.forEach((ev) => {
      if (ev.title.toLowerCase().includes(t) || ev.description.toLowerCase().includes(t)) {
        list.push({ title: ev.title, category: `Kegiatan (${ev.category})`, description: ev.description, tab: "Kegiatan" });
      }
    });

    // Search News
    INITIAL_NEWS.forEach((n) => {
      if (n.title.toLowerCase().includes(t) || n.content.toLowerCase().includes(t)) {
        list.push({ title: n.title, category: `Kabar Berita (${n.category})`, description: n.content, tab: "Berita" });
      }
    });

    return list;
  })();

  const sideMenu = [
    { id: "Dashboard", label: "Dashboard Utama", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { id: "Kegiatan", label: "Kegiatan & Proker", icon: <Compass className="h-4.5 w-4.5" /> },
    { id: "Pengumuman", label: "Pengumuman OSIS", icon: <Megaphone className="h-4.5 w-4.5" /> },
    { id: "Aspirasi", label: "Suara & Aspirasi Siswa", icon: <HandHelping className="h-4.5 w-4.5" /> },
    { id: "Voting", label: "E-Voting Digital", icon: <Vote className="h-4.5 w-4.5" /> },
    { id: "Piket", label: "Jadwal Piket OSIS", icon: <Calendar className="h-4.5 w-4.5" /> },
    ...(isAdminOrPengurus ? [
      { id: "Absensi", label: "Absensi Anggota", icon: <UserCheck className="h-4.5 w-4.5" /> },
      { id: "Notulensi", label: "Notulensi Rapat", icon: <FileText className="h-4.5 w-4.5" /> },
      { id: "Keuangan", label: "Keuangan & Kas OSIS", icon: <Landmark className="h-4.5 w-4.5" /> }
    ] : []),
    { id: "Berita", label: "Kabar & Prestasi", icon: <BookMarked className="h-4.5 w-4.5" /> },
    { id: "Struktur", label: "Bagan Struktur OSIS", icon: <Users className="h-4.5 w-4.5" /> },
  ];

  if (isAdmin) {
    sideMenu.push({ id: "AdminPanel", label: "Menu Admin", icon: <ShieldCheck className="h-4.5 w-4.5" /> });
  }

  return (
    <div className="flex h-screen bg-slate-50 border-none font-sans overflow-hidden">
      
      {/* 1. Desktop Sidebar Navigation Layout (Light Mode) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 z-20 shrink-0 justify-between shadow-sm">
        <div>
          {/* School Name banner */}
          <div className="p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 overflow-hidden">
                <img src={osisLogo} alt="Logo OSIS" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="font-extrabold text-xs tracking-wider text-slate-800 font-sans">
                  SMKN 1 BANDAR
                </h1>
                <p className="text-[9.5px] font-bold text-slate-400 tracking-widest font-mono">
                  PORTAL OSIS 2026
                </p>
              </div>
            </div>
          </div>

          {/* Links list */}
          <nav className="p-4 space-y-1">
            {sideMenu.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-[12px] font-semibold tracking-wide border transition-all cursor-pointer z-10 ${
                    isActive
                      ? "text-blue-600 border-blue-200/55 shadow-xs"
                      : "text-slate-500 border-transparent hover:bg-slate-50/50 hover:text-slate-800"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-blue-50 border-l-4 border-blue-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                    />
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User logout and profile stats */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 mb-3 shadow-sm">
            <div className="truncate max-w-[130px]">
              <p className="text-[11px] font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[9.5px] font-semibold text-slate-400 mt-0.5">{currentUser.role}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-1 px-1.5 hover:bg-rose-50 rounded-lg text-rose-600 hover:text-rose-700 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="text-[9.5px] font-mono text-slate-400 text-center">
            Masa Bakti: 2026/2027
          </div>
        </div>
      </aside>

      {/* 2. Main Workstation Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        
        {/* Navigation Header bar (Light Mode) */}
        <header className="h-16 border-b border-slate-200 bg-white/90 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              id="mobile-nav-toggle"
            >
              ☰
            </button>
            
            <div className="lg:hidden flex items-center gap-2 text-xs text-slate-800 font-extrabold uppercase tracking-wider">
              <div className="h-10 w-10 rounded-full border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                <img src={osisLogo} alt="Logo OSIS" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              OSIS SMKN 1
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500 font-semibold">
              <Compass className="h-4 w-4 text-slate-400 animate-[spin_5s_linear_infinite]" />
              <span>Portal OSIS SMKN 1 Bandar • Hub</span>
            </div>
          </div>

          {/* Action Hubs: Search, Notifications, Profile details */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 border border-slate-250 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-colors shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <Search className="h-4 w-4 text-slate-400" />
                <span className="hidden sm:inline text-slate-600">Pencarian Global...</span>
              </button>

              {/* Search Modal dropdown overlay */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-30 space-y-3 text-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Pencarian Sekolah</span>
                      <button onClick={() => setIsSearchOpen(false)} className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Cari pengumuman, kegiatan, berita..."
                      value={globalSearchToken}
                      onChange={(e) => setGlobalSearchToken(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />

                    {/* Search results list */}
                    {searchResults.length > 0 && (
                      <div className="max-h-56 overflow-y-auto space-y-2 divider divide-slate-100">
                        {searchResults.map((res, i) => (
                           <div
                             key={i}
                             onClick={() => {
                               setActiveTab(res.tab);
                               setIsSearchOpen(false);
                             }}
                             className="p-2 text-left bg-slate-50/50 hover:bg-slate-100/80 border border-slate-200/50 rounded-xl cursor-pointer"
                           >
                            <span className="text-[10px] text-blue-600 font-mono block font-bold">{res.category}</span>
                            <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{res.title}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-1 truncate mt-0.5">{res.description}</p>
                           </div>
                        ))}
                      </div>
                    )}
                    {globalSearchToken && searchResults.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">Kata kunci pencarian tidak ditemukan.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification alert bells */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 border border-slate-250 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 transition-colors shadow-sm relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-30"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Notifikasi Sistem</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {notifications.map((not, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 font-medium">
                          {not}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Display Panel viewport (Light Mode background) */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden bg-slate-50 p-4 sm:p-6 md:p-8 flex flex-col lg:h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-h-0 flex flex-col pb-6"
            >
              {activeTab === "Dashboard" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <DashboardView
                    announcements={announcements}
                    events={events}
                    finances={finances}
                    onNavigate={setActiveTab}
                    currentUser={currentUser}
                    onAddAspiration={handleAddAspiration}
                    aspirations={aspirations}
                    onUpvoteAspiration={handleUpvoteAspiration}
                  />
                </div>
              )}

              {activeTab === "Pengumuman" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <PengumumanView
                    announcements={announcements}
                    isAdminOrPengurus={isAdminOrPengurus}
                    onAddAnnouncement={handleAddAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    currentUser={currentUser}
                  />
                </div>
              )}

              {activeTab === "Aspirasi" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <AspirasiView
                    aspirations={aspirations}
                    isAdminOrPengurus={isAdminOrPengurus}
                    onAddAspiration={handleAddAspiration}
                    onRespondAspiration={handleRespondAspiration}
                    onUpvoteAspiration={handleUpvoteAspiration}
                    currentUser={currentUser}
                  />
                </div>
              )}

              {activeTab === "Voting" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <VotingView
                    votes={votes}
                    currentUser={currentUser}
                    onCastVote={handleCastVote}
                    isAdmin={isAdmin}
                    onAddVote={handleAddVote}
                  />
                </div>
              )}

              {activeTab === "Notulensi" && isAdminOrPengurus && (
                <NotulensiView
                  minutes={minutes}
                  isAdminOrPengurus={isAdminOrPengurus}
                  onAddMinute={handleAddMinute}
                  onDeleteMinute={handleDeleteMinute}
                  currentUser={currentUser}
                />
              )}

              {activeTab === "Keuangan" && isAdminOrPengurus && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <KeuanganView
                    finances={finances}
                    isAdmin={isAdmin}
                    onAddTransaction={handleAddTransaction}
                    onResetFinances={handleResetFinances}
                    currentUser={currentUser}
                  />
                </div>
              )}

              {activeTab === "Absensi" && isAdminOrPengurus && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <AbsensiView
                    attendance={attendance}
                    members={members}
                    isAdmin={isAdmin}
                    isAdminOrPengurus={isAdminOrPengurus}
                    onSaveAttendance={handleSaveAttendance}
                    onDeleteAttendance={handleDeleteAttendance}
                    currentUser={currentUser}
                  />
                </div>
              )}

              {activeTab === "Piket" && (
                <PiketView
                  piketSchedule={piketSchedule}
                  members={members}
                  isAdminOrPengurus={isAdminOrPengurus}
                  onUpdatePiketSchedule={handleUpdatePiketSchedule}
                  currentUser={currentUser || { name: "Siswa Tamu", role: "Siswa" }}
                />
              )}

              {activeTab === "Kegiatan" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <KegiatanView
                    events={events}
                    prokers={prokers}
                    isAdminOrPengurus={isAdminOrPengurus}
                    currentUser={currentUser || { name: "Siswa Tamu", role: "Siswa" }}
                    onAddEvent={handleAddEvent}
                    onRegisterEvent={handleRegisterEvent}
                    onCheckAttendance={handleCheckAttendance}
                    onAddProker={handleAddProker}
                    onUpdateProkerStatus={handleUpdateProkerStatus}
                  />
                </div>
              )}

              {activeTab === "Berita" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <BeritaView />
                </div>
              )}

              {activeTab === "Struktur" && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <StrukturView />
                </div>
              )}

              {activeTab === "AdminPanel" && isAdmin && (
                <div className="flex-1 overflow-y-auto pr-1 pb-16">
                  <AdminPanel
                    members={members}
                    onAddMember={handleAddMember}
                    auditLogs={logs}
                    attendanceList={attendance}
                    onSaveAttendance={handleSaveAttendance}
                    onDownloadBackup={handleDownloadBackup}
                    onRestoreBackup={handleRestoreBackup}
                    onResetAllData={handleResetAllData}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Sliding Mobile Drawer Navigation Overlay (Light Mode support) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden cursor-pointer"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-40 p-6 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-800">
                    <div className="h-10 w-10 rounded-full border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                      <img src={osisLogo} alt="Logo OSIS" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    </div>
                    OSIS SMKN 1
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {sideMenu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-850"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between mb-3 truncate">
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 leading-tight block truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase leading-none font-bold mt-1 block truncate">{currentUser.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
