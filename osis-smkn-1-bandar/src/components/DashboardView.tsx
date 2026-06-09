import React, { useState } from "react";
import { Announcement, OsisEvent, FinancialRecord, StudentAspiration } from "../types";
import { Award, Megaphone, Calendar, TrendingUp, Landmark, ChevronRight, UserCheck, Image, Maximize2, X, ChevronLeft, Inbox, ShieldAlert, Send, Check, ThumbsUp, CheckCircle2 } from "lucide-react";
import osisLogo from "../assets/images/logo_osis.png";
import leadersPhoto from "../assets/images/Ketua osis dan wakil ketua osis.png";
import pembinaPhoto from "../assets/images/Pembina osis.png";

// Import real school activity images
import natalImg from "../assets/images/Merayakan Acara Natal SMK Negeri 1 Bandar.jpeg";
import israMirajImg from "../assets/images/Perayaan Isra Miraj SMK NEGERI 1 BANDAR.jpeg";
import voliImg from "../assets/images/Pertandingan Silatuhrami Volly antar Sekolah.jpeg";
import mplsImg from "../assets/images/Penerimaan Murid Kelas 10.jpeg";
import hariGuruImg from "../assets/images/Hari Guru.jpeg";
import galeri1Img from "../assets/images/Galeri 1 osis.jpg";

interface DashboardViewProps {
  announcements: Announcement[];
  events: OsisEvent[];
  finances: FinancialRecord[];
  onNavigate: (tab: string) => void;
  currentUser: { name: string; role: string } | null;
  onAddAspiration?: (item: Omit<StudentAspiration, "id" | "date" | "status" | "upvotes">) => void;
  aspirations?: StudentAspiration[];
  onUpvoteAspiration?: (id: string) => void;
}

const KEGIATAN_GALLERY = [
  {
    id: 1,
    title: "Perayaan Hari Natal Sekolah",
    description: "Suka cita kedamaian bersama seluruh guru dan siswa-siswi Kristiani dalam perayaan Natal bersama SMK Negeri 1 Bandar.",
    date: "18 Desember 2025",
    image: natalImg,
    badge: "Keagamaan",
  },
  {
    id: 2,
    title: "Perayaan Isra Mi'raj SAW",
    description: "Meningkatkan keimanan, ketakwaan diri, serta mempererat tali kekeluargaan segenap siswa Muslim di SMKN 1 Bandar.",
    date: "12 Februari 2026",
    image: israMirajImg,
    badge: "Keimanan",
  },
  {
    id: 3,
    title: "Turnamen Persahabatan Voli",
    description: "Pertandingan silaturahmi olahraga voli putra & putri antar sekolah guna memupuk sportivitas tinggi kepemudaan.",
    date: "04 Maret 2026",
    image: voliImg,
    badge: "Jasmani & Olahraga",
  },
  {
    id: 4,
    title: "Penerimaan Murid Kelas 10",
    description: "Penyambutan hangat dan pengenalan budaya lingkungan sekolah (MPLS) demi kenyamanan belajar siswa baru.",
    date: "15 Juli 2025",
    image: mplsImg,
    badge: "Kesiswaan",
  },
  {
    id: 5,
    title: "Apresiasi Hari Guru Nasional",
    description: "Kejutan manis dan tanda bakti hangat seluruh pengurus OSIS beserta siswa bagi Bapak & Ibu Guru tercinta.",
    date: "25 November 2025",
    image: hariGuruImg,
    badge: "Sosial & Berbakti",
  },
  {
    id: 6,
    title: "Rapat & Evaluasi Pengurus OSIS",
    description: "Koordinasi bulanan dan pematangan strategi program kerja triwulan komite OSIS SMKN 1 Bandar agar tetap terukur.",
    date: "10 Januari 2026",
    image: galeri1Img,
    badge: "Rapat Kerja",
  }
];

export default function DashboardView({
  announcements,
  events,
  finances,
  onNavigate,
  currentUser,
  onAddAspiration,
  aspirations = [],
  onUpvoteAspiration,
}: DashboardViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof KEGIATAN_GALLERY[0] | null>(null);

  // Suggested Box/Kotak Saran panel state
  const [showKotakSaran, setShowKotakSaran] = useState(false);
  const [saranCategory, setSaranCategory] = useState<"Kritik & Saran" | "Fasilitas" | "Kegiatan" | "Kantin" | "Lainnya">("Kritik & Saran");
  const [saranText, setSaranText] = useState("");
  const [saranIsAnonymous, setSaranIsAnonymous] = useState(false);
  const [saranName, setSaranName] = useState("");
  const [saranContact, setSaranContact] = useState("");
  const [isSaranSubmitted, setIsSaranSubmitted] = useState(false);

  // Filter and management for public aspirations feed
  const [pubFilterCategory, setPubFilterCategory] = useState<string>("Semua");
  const [pubFilterStatus, setPubFilterStatus] = useState<string>("Semua");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const handleLocalUpvote = (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds(prev => ({ ...prev, [id]: true }));
    if (onUpvoteAspiration) {
      onUpvoteAspiration(id);
    }
  };

  const handleSaranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saranText.trim()) return;

    const author = saranIsAnonymous ? "Siswa Anonim" : (saranName.trim() || (currentUser ? currentUser.name : "Siswa SMKN 1 Bandar"));
    const textWithContact = saranContact.trim() 
      ? `${saranText}\n\n(Kontak Pengirim: ${saranContact})` 
      : saranText;

    if (onAddAspiration) {
      onAddAspiration({
        category: saranCategory,
        text: textWithContact,
        isAnonymous: saranIsAnonymous,
        authorName: author,
      });
    } else {
      // Local fallback
      const savedAsp = localStorage.getItem("osis_aspirations");
      const currentList = savedAsp ? JSON.parse(savedAsp) : [];
      const fresh = {
        id: `asp-${Date.now()}`,
        category: saranCategory,
        text: textWithContact,
        date: new Date().toISOString().substring(0, 10),
        isAnonymous: saranIsAnonymous,
        authorName: author,
        status: "Baru",
        upvotes: 0,
      };
      localStorage.setItem("osis_aspirations", JSON.stringify([fresh, ...currentList]));
    }

    setIsSaranSubmitted(true);
    setSaranText("");
    setSaranContact("");
    setSaranName("");
    setSaranIsAnonymous(false);

    // Close screen after a lovely success message
    setTimeout(() => {
      setIsSaranSubmitted(false);
      setShowKotakSaran(false);
    }, 2200);
  };

  // Statistics calculators
  const totalKas = finances.reduce((acc, curr) => {
    return curr.type === "Pemasukan" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const formattedKas = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalKas);

  const totalRegisteredEvents = events.length;
  const totalPosts = announcements.length;


  return (
    <div className="space-y-8 font-sans" id="dashboard-view-wrapper">
      {/* Visual Welcome Banner */}
      <div className="relative bg-white border border-slate-200/90 p-6 md:p-8 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row justify-between items-center gap-8" id="greeting-school-banner">
        
        <div className="flex-1 max-w-2xl space-y-4">
          <div>
            <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-200/60 uppercase tracking-widest">
              SMK Negeri 1 Bandar
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Selamat Datang di Portal Resmi <br />
            <span className="text-blue-600 font-black">
              OSIS SMKN 1 BANDAR
            </span>
          </h1>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Sistem Management Hub angkatan 2026/2027. Akses pengumuman kesiswaan, agenda program kerja seksi bidang, sampaikan aspirasi Anda secara murni, ikuti e-voting pemilihan pengurus, dan awasi laporan keuangan kas OSIS yang dikelola secara transparan dan amanah.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate("Kegiatan")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              Lihat Kegiatan
            </button>
            <button
              onClick={() => setShowKotakSaran(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Inbox className="h-4 w-4 text-blue-500" />
              <span>Kotak Saran &amp; Pengaduan</span>
            </button>
          </div>
        </div>

        {/* Leaders Photo - Clean waist-up crop (No feet, no border box or overlay badge) */}
        <div className="shrink-0 relative flex flex-col items-center">
          <div className="h-64 w-60 md:h-72 md:w-64 rounded-2xl overflow-hidden">
            <img
              src={leadersPhoto}
              alt="Zora Rizky Salsabila & Yuga Febrian"
              className="w-full h-full object-cover object-top scale-100 hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Label text */}
          <div className="mt-2.5 text-center space-y-0.5">
            <p className="text-[11px] font-bold text-slate-800">
              ZR. Salsabila &amp; Yuga Febrian
            </p>
            <p className="text-[9.5px] text-slate-500 font-medium">
              Ketua &amp; Wakil Ketua OSIS Utama
            </p>
          </div>
        </div>

        {/* Current user session pill close to the corner */}
        {currentUser && (
          <div className="hidden sm:flex absolute top-4 right-4 items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-600" id="user-session-badge">
            <UserCheck className="h-3 w-3 text-blue-500" />
            <span>Login: {currentUser.name}</span>
          </div>
        )}
      </div>

      {/* Statistics Panels (Bento light style) */}
      <div className="grid grid-cols-1 max-w-sm" id="stats-dashboard-grid">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/95 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Anggota Terdaftar</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg md:text-2xl font-bold text-slate-900 mt-2">51 Anggota</p>
          <div className="flex items-center gap-1 text-[10px] text-indigo-500 mt-1.5 font-medium">
            <span>Seksi bidang kolaboratif</span>
          </div>
        </div>
      </div>

      {/* Dual Column: Core Greetings (Pembina vs Ketua) - Light style */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="welcome-greetings-grid">
        {/* Greetings from Pembina OSIS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-stretch h-full">
          {/* Portrait of Pembina OSIS - "tidak di bingkai" (no border frame, just raw clean large image) */}
          <div className="w-full sm:w-40 sm:h-56 md:w-44 md:h-64 shrink-0 relative overflow-hidden rounded-2xl">
            <img
              src={pembinaPhoto}
              alt="Janris Pandiangan, S.Kom"
              className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-transparent flex items-center justify-center text-slate-700 font-extrabold text-2xl -z-10 rounded-2xl">
              JP
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-flex bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                Pembina OSIS SMKN 1 Bandar
              </span>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight mt-3">
                Janris Pandiangan, S.Kom
              </h3>
              <p className="text-slate-400 text-[10px] font-bold mt-0.5">NIP. 19830521 201101 1003</p>
              
              <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed mt-3 font-medium">
                "Assalamu'alaikum Wr. Wb. Sebagai Pembina OSIS, saya berharap portal digital ini dapat memajukan efektivitas komunikasi, transparansi keuangan secara menyeluruh, serta memudahkan siswa dalam menyampaikan aspirasi demi memajukan SMKN 1 Bandar."
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Masa Bakti: 2026/2027
            </div>
          </div>
        </div>

        {/* Greetings from Ketua OSIS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-stretch h-full">
          {/* Stylized Emerald Monogram representing Ketua OSIS to avoid duplicating the leaders joint photo */}
          <div className="w-full sm:w-40 sm:h-56 md:w-44 md:h-64 shrink-0 relative overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-100 border border-emerald-200/60 flex flex-col items-center justify-center text-center p-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg md:text-2xl font-black shadow-sm mb-3">
              ZR
            </div>
            <p className="text-[10px] font-extrabold text-emerald-800 tracking-wider uppercase mb-1">MASA BAKTI</p>
            <p className="text-[10px] text-emerald-600 font-bold">2026 / 2027</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <span className="inline-flex bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                Ketua OSIS SMKN 1 Bandar
              </span>
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight mt-3">
                Zora Rizky Salsabila
              </h3>
              <p className="text-slate-400 text-[10px] font-bold mt-0.5">NISN. 0087459312 • Kelas XI RPL</p>
              
              <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed mt-3 font-medium">
                "Mari jalin kerja sama yang solid di kepengurusan tahun ini. Dengan adanya OSIS SMKN 1 Bandar web hub ini, kita semua dapat melihat program kerja seksi yang transparan, mengakses laporan bulanan secara real-time, menggalang aspirasi murni, dan menjalankan voting jujur."
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Kelas XI RPL • Bhakti OSIS
            </div>
          </div>
        </div>
      </div>

      {/* Kotak Saran & Laporan Siswa - Inline interactive card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-sm space-y-4" id="public-kotak-saran-banner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-widest">
              SUARA &amp; ASPIRASI SISWA
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Inbox className="h-5 w-5 text-blue-600 animate-pulse" />
              Kotak Saran &amp; Pengaduan SMKN 1 Bandar
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
              Punya usul kegiatan baru? Ada gangguan sekolah atau sarana prasarana kelas? Kirim pengaduan, laporan, atau gagasan konstruktif Anda secara mudah di sini. Kami menjamin kerahasiaan identitas Anda (bisa anonim).
            </p>
          </div>
          <button
            onClick={() => setShowKotakSaran(true)}
            className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-start md:self-center"
          >
            <Send className="h-3.5 w-3.5 animate-pulse" />
            Salurkan Pengaduan Anda
          </button>
        </div>
      </div>

      {/* Papan Koleksi Laporan & Saran Masuk */}
      {currentUser?.name === "Jumpa Pardomuan Butar Butar" && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6" id="public-kotak-saran-feed">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-2 uppercase tracking-wider">
                <Inbox className="h-4.5 w-4.5 text-blue-600" />
                Tempat Pengumpulan &amp; Status Laporan
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Daftar seluruh saran, laporan keluhan, dan tindak lanjut (Hanya terlihat oleh Anda selaku Developer/Jumpa)
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Filter Kategori:</span>
              <select
                value={pubFilterCategory}
                onChange={(e) => setPubFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 p-1.5 px-3 rounded-lg font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Kritik & Saran">💡 Kritik & Saran</option>
                <option value="Fasilitas">🏫 Fasilitas & Infrastruktur</option>
                <option value="Kegiatan">🎭 Kegiatan OSIS</option>
                <option value="Kantin">🍜 Kantin</option>
                <option value="Lainnya">📝 Lainnya</option>
              </select>
            </div>
          </div>

          {/* List layout */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {(() => {
              const list = aspirations.filter((item) => {
                const matchesCat = pubFilterCategory === "Semua" || item.category === pubFilterCategory;
                return matchesCat;
              });

              if (list.length === 0) {
                return (
                  <div className="text-center py-10 bg-slate-50 border border-slate-200/60 rounded-2xl">
                    <p className="text-slate-400 text-xs font-medium">Belum ada saran terdaftar pada kategori ini. Jadilah yang pertama!</p>
                  </div>
                );
              }

              return list.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-slate-50/65 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider ${
                            item.status === "Baru"
                              ? "bg-slate-100 text-slate-650 border border-slate-200"
                              : item.status === "Diproses"
                              ? "bg-amber-100/80 text-amber-700 border border-amber-200/60 animate-pulse"
                              : "bg-emerald-100/80 text-emerald-700 border border-emerald-300/60 font-black"
                          }`}
                        >
                          • {item.status}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-450 font-mono font-bold">
                        Oleh: <span className="text-slate-600">{item.isAnonymous ? "Siswa Anonim (Rahasia)" : item.authorName}</span> • 📅 {item.date}
                      </div>
                    </div>

                    <button
                      onClick={() => handleLocalUpvote(item.id)}
                      className={`flex items-center gap-1.5 p-1.5 px-3 rounded-xl border transition-all text-xs cursor-pointer font-bold ${
                        upvotedIds[item.id]
                          ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{item.upvotes + (upvotedIds[item.id] ? 1 : 0)}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-750 font-sans italic leading-relaxed whitespace-pre-line bg-white/75 p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                    "{item.text.split("\n\n(Kontak Pengirim:")[0]}"
                  </p>

                  {item.adminResponse && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-150 rounded-xl flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] uppercase font-black tracking-wider text-emerald-700 block">Tanggapan Resmi Pembina / Pengurus OSIS:</span>
                        <p className="text-xs text-slate-700 italic font-medium leading-relaxed">"{item.adminResponse}"</p>
                      </div>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Bottom section: OSIS Activities Gallery (Full Width) */}
      <div className="w-full" id="dashboard-recent-grid">
        {/* OSIS Activities Gallery */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="gallery-widget-container">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-500" />
                Dokumentasi Kegiatan OSIS SMKN 1 Bandar
              </h3>
              <p className="text-[10px] text-slate-400 font-mono font-bold">6 Dokumentasi Utama</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {KEGIATAN_GALLERY.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:border-blue-400 hover:shadow transition-all"
                  id={`gallery-photo-${photo.id}`}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-1 left-1 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-extrabold text-slate-700 tracking-tight uppercase border border-slate-100">
                    {photo.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Klik foto untuk info lengkap kegiatan.</span>
            <span
              className="text-blue-600 font-bold hover:text-blue-700 cursor-pointer flex items-center gap-1"
              onClick={() => setSelectedPhoto(KEGIATAN_GALLERY[0])}
            >
              Spotlight Kegiatan <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Photo Spotlight Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative animate-[slideUp_0.3s_ease]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-1.5 bg-white/90 hover:bg-slate-100 hover:text-slate-800 rounded-full text-slate-500 z-10 shadow-sm transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Photo */}
            <div className="h-60 sm:h-72 relative bg-slate-50 overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-blue-600/90 text-white text-[9.5px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                {selectedPhoto.badge}
              </span>
            </div>

            {/* Description details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>🗓️ {selectedPhoto.date}</span>
                <span>DOKUMENTASI RESMI OSIS</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {selectedPhoto.description}
              </p>
              
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Pratonton
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Suggestion/Kotak Saran Modal */}
      {showKotakSaran && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative animate-[slideUp_0.3s_ease] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8.5 w-8.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                  <Inbox className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-none">Kotak Saran &amp; Pengaduan</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Sampaikan masukan Anda ke Pembina &amp; Pengurus OSIS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKotakSaran(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content Form Scroll Container */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {isSaranSubmitted ? (
                <div className="text-center py-8 space-y-3 flex flex-col items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center animate-bounce">
                    <Check className="h-7 w-7 stroke-[3px]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Masukan Berhasil Terkirim!</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Saran atau laporan Anda telah berhasil disalurkan ke sistem utama OSIS SMKN 1 Bandar dengan aman.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaranSubmit} className="space-y-4">
                  {/* Category Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      PILIH KATEGORI LAPORAN
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["Kritik & Saran", "Fasilitas", "Kegiatan", "Kantin", "Lainnya"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSaranCategory(cat)}
                          className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                            saranCategory === cat
                              ? "bg-blue-50 text-blue-600 border-blue-400 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {cat === "Kritik & Saran" ? "💡 Kritik & Saran" :
                           cat === "Fasilitas" ? "🏫 Infrastruktur & Fasilitas" :
                           cat === "Kegiatan" ? "🎭 Kegiatan OSIS" :
                           cat === "Kantin" ? "🍜 Kantin & Kebersihan" : "📝 Lainnya / Umum"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Anonymous Switch */}
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="anonymous-saran-toggle" className="text-xs font-bold text-slate-800 cursor-pointer block">
                        Kirim sebagai Anonim
                      </label>
                      <span className="text-[10px] text-slate-400 block block">Sembunyikan nama asli Anda dari pengurus</span>
                    </div>
                    <input
                      id="anonymous-saran-toggle"
                      type="checkbox"
                      checked={saranIsAnonymous}
                      onChange={(e) => setSaranIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Name field (Conditional) */}
                  {!saranIsAnonymous && (
                    <div className="space-y-1.5 animate-[fadeIn_0.2s_ease]">
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        NAMA PENGIRIM (OPSIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Jumpa - XI TOI 1"
                        value={saranName}
                        onChange={(e) => setSaranName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Contact field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      NO WHATSAPP / KONTAK (OPSIONAL, RAHASIA)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812-3456-7890 (Untuk tindak lanjut)"
                      value={saranContact}
                      onChange={(e) => setSaranContact(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-[9.5px] text-slate-400 block leading-tight">
                      *Kontak WhatsApp tidak akan dipublikasikan ke siswa lain, hanya untuk verifikasi pengurus jika dibutuhkan.
                    </span>
                  </div>

                  {/* Main Text */}
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      ISI LAPORAN ATAU SARAN KANDIDAT
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Silakan sampaikan pesan saran, laporan keluhan, atau gagasan kegiatan Anda secara sopan dan terperinci..."
                      value={saranText}
                      onChange={(e) => setSaranText(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowKotakSaran(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!saranText.trim()}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-750 disabled:opacity-50 text-white font-black text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      Kirim Masukan
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
