import React, { useState } from "react";
import { INITIAL_MEMBERS } from "../data/osisMembers";
import { OSISMember } from "../types";
import { Users, Search, Award, ShieldAlert, GraduationCap, Heart, HelpCircle, FileText, Camera, ShieldCheck } from "lucide-react";

const SECTION_DESCRIPTIONS: { [key: string]: string } = {
  "Pembina OSIS": "Membimbing, mengarahkan, dan mengawasi seluruh jalannya program kerja kepengurusan OSIS SMKN 1 Bandar.",
  "Ketua OSIS": "Memimpin jalannya organisasi, mewakili OSIS baik internal maupun eksternal, dan mengoordinasikan seluruh program kerja pengurus.",
  "Wakil Ketua OSIS": "Membantu Ketua dalam mengawasi pelaksanaan program kerja seksi bidang dan mendampingi tugas ketua dalam segala kegiatan.",
  "Sekretaris": "Mengelola seluruh administrasi, menyusun surat, proposal, notulen rapat, laporan tahunan, dan pengarsipan berkas OSIS.",
  "Bendahara": "Mencatat sirkulasi dana masuk dan keluar, menyusun rancangan anggaran kegiatan, dan merancang kuitansi serta laporan transparansi dana gratis.",
  "Seksi Keimanan dan Ketakwaan": "Mengadakan kegiatan keagamaan, memperingati hari besar keagamaan, dan menumbuhkan toleransi beragama antar siswa.",
  "Seksi Budi Pekerti Luhur dan Akhlak Mulia": "Melaksanakan tata tertib sekolah secara persuasif, menumbuhkan sopan santun, bakti sosial, dan aksi aksi kemanusiaan.",
  "Seksi Kehidupan Berbangsa": "Melaksanakan upacara bendera, memelihara nilai-nilai perjuangan bangsa, patriotisme, dan bela negara.",
  "Seksi Akademik, Seni dan Olahraga": "Mengembangkan potensi akademis, mewadahi bakat kesenian sekolah, dan menyelenggarakan turnamen olahraga berkala.",
  "Seksi Demokrasi dan Lingkungan Hidup": "Mendorong kebebasan berpendapat, melakukan pemilihan raya, kerja bakti lingkungan, pengelolaan sampah, dsb.",
  "Seksi Kreativitas dan Kewirausahaan": "Mengembangkan keterampilan kewirausahaan, memproduksi kerajinan siswa, dan mengasah kemandirian finansial OSIS.",
  "Seksi Jasmani, Kesehatan dan Gizi": "Mengawasi kesehatan kantin sekolah, menyosialisasikan pentingnya gizi siswa, menyelenggarakan kegiatan UKS dan PMR.",
  "Seksi Sastra dan Budaya": "Melestarikan sastra daerah, mading sekolah, lomba penulisan puisi, drama teater, serta apresiasi budaya lokal.",
  "Seksi Informasi dan Komunikasi": "Mengelola akun media sosial resmi sekolah/OSIS, publikasi foto dokumentasi kegiatan, dan menyusun buletin pengurus."
};

export default function StrukturView({ isSidebar = false }: { isSidebar?: boolean } = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState("Semua");

  const filteredMembers = INITIAL_MEMBERS.filter((member) => {
    // Only allow Core/BPH roles or Section Coordinator roles (exclude ordinary members and Pembina)
    const isCoreOrCoordinator = [
      "Ketua OSIS",
      "Wakil Ketua OSIS",
      "Sekretaris",
      "Bendahara",
      "Koordinator Seksi"
    ].includes(member.role);

    if (!isCoreOrCoordinator) {
      return false;
    }

    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.section && member.section.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Section matcher
    let matchesSection = true;
    if (selectedSectionFilter !== "Semua") {
      if (selectedSectionFilter === "Inti") {
        matchesSection = ["Pembina OSIS", "Ketua OSIS", "Wakil Ketua OSIS", "Sekretaris", "Bendahara"].includes(member.role);
      } else {
        matchesSection = member.section === selectedSectionFilter;
      }
    }

    return matchesSearch && matchesSection;
  });

  const sectionsList = [
    "Semua",
    "Inti",
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

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case "Seksi Keimanan dan Ketakwaan":
        return <Heart className="h-4 w-4 text-emerald-600" />;
      case "Seksi Budi Pekerti Luhur dan Akhlak Mulia":
        return <ShieldCheck className="h-4 w-4 text-rose-600" />;
      case "Seksi Kehidupan Berbangsa":
        return <Award className="h-4 w-4 text-amber-600" />;
      case "Seksi Akademik, Seni dan Olahraga":
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case "Seksi Demokrasi dan Lingkungan Hidup":
        return <Users className="h-4 w-4 text-teal-600" />;
      case "Seksi Kreativitas dan Kewirausahaan":
        return <Award className="h-4 w-4 text-orange-600" />;
      case "Seksi Jasmani, Kesehatan dan Gizi":
        return <Heart className="h-4 w-4 text-red-600" />;
      case "Seksi Sastra dan Budaya":
        return <FileText className="h-4 w-4 text-fuchsia-600" />;
      case "Seksi Informasi dan Komunikasi":
        return <Camera className="h-4 w-4 text-sky-600" />;
      default:
        return <Users className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className={isSidebar ? "space-y-4 font-sans" : "space-y-6 font-sans"} id="struktur-container">
      {/* Structural Header with search controls - light themed */}
      {!isSidebar ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Bagan Kepengurusan Inti &amp; Koordinator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Menampilkan jajaran Pengurus BPH Inti dan Koordinator Seksi Bidang OSIS
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pengurus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-56 rounded-xl border border-slate-250 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            {/* Filter dropdown */}
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="rounded-xl border border-slate-250 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              {sectionsList.map((sec) => (
                <option key={sec} value={sec} className="bg-white text-slate-800">
                  {sec === "Inti" ? "Pengurus BPH Inti" : sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama/seksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-2 py-1.5 text-[11px] text-slate-850 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedSectionFilter}
            onChange={(e) => setSelectedSectionFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer truncate"
          >
            {sectionsList.map((sec) => (
              <option key={sec} value={sec} className="bg-white text-slate-800">
                {sec === "Inti" ? "BPH Inti" : sec}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grid displays */}
      <div className={isSidebar ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"} id="members-grid">
        {filteredMembers.map((member, index) => {
          // Determine roles display details
          let sectionTitle = member.section || "Badan Pengurus Harian (BPH)";
          let desc = SECTION_DESCRIPTIONS[member.role] || SECTION_DESCRIPTIONS[member.section || ""] || "Bertanggung jawab mengoordinasikan and menyukseskan program kerja seksi.";

          // Soft light colors for avatars based on section or role
          const initials = member.name.split(" ").map(n => n[0]).slice(0, 2).join("");

          return (
            <div
              key={index}
              className={`group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-400/50 hover:shadow-md transition-all flex flex-col justify-between ${isSidebar ? "p-3.5" : "p-5"}`}
              id={`member-card-${index}`}
            >
              <div>
                <div className="flex items-start gap-3">
                  {/* Photo Profile / Avatar Initials */}
                  <div className={`h-10 w-10 md:h-11 md:w-11 rounded-xl shrink-0 ${member.avatarStyle} flex items-center justify-center font-bold text-white text-xs md:text-sm shadow-sm relative overflow-hidden`}>
                    {initials}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-xs md:text-sm group-hover:text-blue-600 transition-colors truncate">
                      {member.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] md:text-[9.5px]/none font-extrabold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                        {member.role === "Pembina OSIS" ? "Pembina" : member.role}
                      </span>
                      {member.subSection && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] md:text-[9.5px]/none font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                          {member.subSection}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={isSidebar ? "mt-2 pt-2 border-t border-slate-100" : "mt-4 pt-3 border-t border-slate-100"}>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    {getSectionIcon(sectionTitle)}
                    <span className="truncate max-w-[200px]">{sectionTitle}</span>
                  </div>
                  <p className="text-xs text-slate-550 leading-relaxed line-clamp-2 md:line-clamp-3">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Extra details at the bottom of cards */}
              {!isSidebar && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono font-medium">
                  <span>Masa Jabatan: 2026/2027</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <ShieldAlert className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Pengurus tidak ditemukan dengan kriteria tersebut.</p>
        </div>
      )}
    </div>
  );
}
