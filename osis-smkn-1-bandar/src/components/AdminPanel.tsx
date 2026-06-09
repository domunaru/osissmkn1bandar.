import React, { useState } from "react";
import { OSISMember, AuditLog, MeetingAttendance } from "../types";
import { UserCheck, ShieldCheck, Database, Search, PlusCircle, Trash, ListTodo, Download, RefreshCw, UserPlus } from "lucide-react";

interface AdminPanelProps {
  members: OSISMember[];
  onAddMember: (member: OSISMember) => void;
  auditLogs: AuditLog[];
  attendanceList: MeetingAttendance[];
  onSaveAttendance: (meetingTitle: string, absensi: { memberName: string; role: string; status: "Hadir" | "Izin" | "Sakit" | "Alfa"; timeIn: string }[]) => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (file: File) => void;
  onResetAllData: () => void;
}

export default function AdminPanel({
  members,
  onAddMember,
  auditLogs,
  attendanceList,
  onSaveAttendance,
  onDownloadBackup,
  onRestoreBackup,
  onResetAllData,
}: AdminPanelProps) {
  // Navigation inside Admin Dashboard
  const [adminTab, setAdminTab] = useState<"Absensi" | "Registrasi" | "Audits" | "Backup">("Absensi");

  // Form registration states
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("Anggota Seksi");
  const [regSection, setRegSection] = useState("Seksi Keimanan dan Ketakwaan");
  const [regSubSection, setRegSubSection] = useState("");
  const [regPassword, setRegPassword] = useState("smkn1bandar*");

  // Absensi manager active states
  const [meetingTitle, setMeetingTitle] = useState("Rapat Evaluasi Bulan Mei");
  const [absensiState, setAbsensiState] = useState<{ [memberName: string]: "Hadir" | "Izin" | "Sakit" | "Alfa" }>({});

  // Initialize absensi state check list
  React.useEffect(() => {
    const initial: { [memberName: string]: "Hadir" | "Izin" | "Sakit" | "Alfa" } = {};
    members.forEach((m) => {
      initial[m.name] = "Hadir";
    });
    setAbsensiState(initial);
  }, [members]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPassword.trim()) {
      alert("Nama and password baru wajib diisi!");
      return;
    }

    onAddMember({
      name: regName,
      role: regRole,
      section: regRole !== "Pembina OSIS" ? regSection : undefined,
      subSection: regSubSection || undefined,
      password: regPassword,
      avatarStyle: "bg-gradient-to-tr from-slate-600 to-indigo-600",
    });

    alert(`✓ ANGGOTA BERHASIL DIDAFTARKAN!\nNama: ${regName}\nJabatan: ${regRole}\nPassword: ${regPassword}`);
    setRegName("");
    setRegPassword("smkn1bandar*");
  };

  const handleSaveAbsensi = () => {
    const records = members.map((m) => ({
      memberName: m.name,
      role: m.role,
      status: absensiState[m.name] || "Hadir",
      timeIn: absensiState[m.name] === "Hadir" ? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
    }));

    onSaveAttendance(meetingTitle, records);
    alert(`✓ ABSENSI RAPAT BERHASIL DISIMPAN!\nSesi Rapat: "${meetingTitle}"\nStatus kehadiran ${records.length} pengurus telah diperbarui.`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onRestoreBackup(files[0]);
    }
  };

  return (
    <div className="space-y-6" id="admin-panel-sub-wrapper">
      {/* Header section */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            Dashboard Administrasi & Penyelenggara
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Menu khusus moderator pengurus inti OSIS SMKN 1 Bandar untuk meregistrasi personel, mengabsen rapat, dan download backup berkas
          </p>
        </div>

        {/* Tabs switcher links */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "Absensi", label: "Absensi Rapat", icon: <ListTodo className="h-4 w-4" /> },
            { id: "Registrasi", label: "Pendaftaran Anggota", icon: <UserPlus className="h-4 w-4" /> },
            { id: "Audits", label: "Log Aktivitas (Audit)", icon: <Search className="h-4 w-4" /> },
            { id: "Backup", label: "Backup & Pemulihan", icon: <Database className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                adminTab === tab.id
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : "bg-slate-900/50 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View layouts based on active tab selection */}

      {/* Tab 1: Absensi Rapat Pengurus */}
      {adminTab === "Absensi" && (
        <div className="space-y-6">
          <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-850/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-emerald-400" />
              Sistem Jurnal Absensi Rapat Anggota
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nama / Agenda Rapat
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g. Rapat Koordinasi Panitia Bulan Bahasa"
                className="w-full sm:w-1/2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
              />
            </div>

            {/* Attendance checklist list */}
            <div className="overflow-x-auto bg-slate-950/40 rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                    <th className="p-3">Nama Anggota</th>
                    <th className="p-3">Jabatan</th>
                    <th className="p-3 text-center">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {members.map((member) => (
                    <tr key={member.name} className="hover:bg-slate-900/40">
                      <td className="p-3 font-medium">{member.name}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{member.role}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {(["Hadir", "Izin", "Sakit", "Alfa"] as const).map((stat) => (
                            <button
                              key={stat}
                              type="button"
                              onClick={() => setAbsensiState({ ...absensiState, [member.name]: stat })}
                              className={`p-1 px-2.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                absensiState[member.name] === stat
                                  ? stat === "Hadir"
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : stat === "Izin"
                                    ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                    : stat === "Sakit"
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                    : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  : "bg-slate-900/40 text-slate-500 border-slate-800/80 hover:text-slate-300"
                              }`}
                            >
                              {stat}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAbsensi}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 cursor-pointer"
              >
                Simpan & Tandatangani Absensi Rapat
              </button>
            </div>
          </div>

          {/* Table history logs */}
          <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Riwayat Sesi Absensi Tersimpan</h4>
            {attendanceList.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">Belum ada riwayat lembar absen tersimpan.</p>
            ) : (
              <div className="space-y-4">
                {attendanceList.map((sch, i) => {
                  const hadir = sch.absensiList.filter((a) => a.status === "Hadir").length;
                  const total = sch.absensiList.length;

                  return (
                    <div key={i} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h5 className="font-semibold text-xs text-slate-200">Sesi: "{sch.meetingTitle}"</h5>
                        <p className="text-[10.5px] text-slate-500 mt-1 font-mono">📅 Disimpan pada: {sch.date}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-emerald-400">Hadir: {hadir}/{total} pengurus</span>
                        <button
                          onClick={() => {
                            const details = sch.absensiList
                              .map((a) => `${a.memberName} (${a.role}): ${a.status}`)
                              .join("\n");
                            alert(`Lembar Absen Sesi: "${sch.meetingTitle}"\n\n${details}`);
                          }}
                          className="px-2.5 py-1 text-[10px] uppercase font-bold bg-slate-800 border border-slate-700 text-slate-300 rounded cursor-pointer"
                        >
                          Rincian Absen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Registrasi Anggota Baru */}
      {adminTab === "Registrasi" && (
        <form onSubmit={handleRegister} className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            Form Registrasi & Pendaftaran Anggota Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nama Lengkap Anggota
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Satria Pratama"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password Login (Lower/Angka)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. satria123"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Jabatan / Peranan
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100 cursor-pointer"
              >
                <option value="Ketua OSIS">Ketua OSIS</option>
                <option value="Wakil Ketua OSIS">Wakil Ketua OSIS</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Koordinator Seksi">Koordinator Seksi</option>
                <option value="Anggota Seksi">Anggota Seksi</option>
                <option value="Pembina OSIS">Pembina OSIS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Pembagian Seksi Bidang
              </label>
              <select
                value={regSection}
                onChange={(e) => setRegSection(e.target.value)}
                disabled={regRole === "Pembina OSIS" || regRole === "Ketua OSIS" || regRole === "Wakil Ketua OSIS" || regRole === "Sekretaris" || regRole === "Bendahara"}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 p-2 text-sm text-slate-100 cursor-pointer disabled:opacity-40"
              >
                <option value="Seksi Keimanan dan Ketakwaan">Seksi Keimanan dan Ketakwaan</option>
                <option value="Seksi Budi Pekerti Luhur dan Akhlak Mulia">Seksi Budi Pekerti Luhur dan Akhlak Mulia</option>
                <option value="Seksi Kehidupan Berbangsa">Seksi Kehidupan Berbangsa</option>
                <option value="Seksi Akademik, Seni dan Olahraga">Seksi Akademik, Seni dan Olahraga</option>
                <option value="Seksi Demokrasi dan Lingkungan Hidup">Seksi Demokrasi dan Lingkungan Hidup</option>
                <option value="Seksi Kreativitas dan Kewirausahaan">Seksi Kreativitas dan Kewirausahaan</option>
                <option value="Seksi Jasmani, Kesehatan dan Gizi">Seksi Jasmani, Kesehatan dan Gizi</option>
                <option value="Seksi Sastra dan Budaya">Seksi Sastra dan Budaya</option>
                <option value="Seksi Informasi dan Komunikasi">Seksi Informasi dan Komunikasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Sub-Unit (e.g. Islam / Olahraga)
              </label>
              <input
                type="text"
                placeholder="e.g. Kristen / Seni (Lebih spesifik)"
                value={regSubSection}
                onChange={(e) => setRegSubSection(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800/80">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Daftarkan Anggota Baru
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Audit Trail Log Aktivitas */}
      {adminTab === "Audits" && (
        <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            Audit Trail Log Sistem Keamanan
          </h3>
          <p className="text-xs text-slate-400">Daftar transparansi perekaman logs aktivitas seluruh pengurus demi tertib tata kelola database digital 2026</p>

          <div className="overflow-x-auto bg-slate-950/40 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-3">Waktu UTC</th>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Kewenangan</th>
                  <th className="p-3">Perlakuan Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20">
                    <td className="p-3 text-slate-500 whitespace-nowrap text-[10.5px]">{log.timestamp}</td>
                    <td className="p-3 text-slate-300 font-bold">{log.user}</td>
                    <td className="p-3 text-slate-400">{log.role}</td>
                    <td className="p-3 text-xs text-slate-200">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Backup Data Otomatis & Pemulihan */}
      {adminTab === "Backup" && (
        <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-400 animate-pulse" />
              Sistem Hub Backup Otomatis Portal OSIS
            </h3>
            <p className="text-xs text-slate-400 mt-1">Ekspor seluruh database pengurus ke folder terenkripsi JSON atau muat ulang basis data dari berkas eksternal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Download Backup */}
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Download className="h-4 w-4 text-blue-400" />
                Unduh Cadangan Penuh (Backup JSON)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencadangan ini mengamankan data: anggota, postingan pengumuman terbaru, lembar absensi rapat, sirkulasi keuangan kas, serta logs audit keamanan yang valid.
              </p>
              <button
                type="button"
                onClick={onDownloadBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                Unduh Cadangan Database
              </button>
            </div>

            {/* Restore Database */}
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-emerald-400" />
                Pulihkan Database Siswa
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih file backup `.json` resmi yang telah Anda cadangkan sebelumnya. Sistem akan mengonversi dan memperbarui isi basis data real-time seketika.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-700 file:bg-slate-800 file:text-slate-300 file:font-semibold hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-5 bg-rose-950/15 border border-rose-900/30 rounded-xl space-y-3 mt-4">
            <h4 className="font-bold text-xs text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              ⚠ DANGER ZONE (ZONA BAHAYA SISTEM)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mereset aplikasi akan menghapus seluruh data berjalan secara permanen: daftar pengumuman, daftar kegiatan, aspirasi siswa, sesi voting beserta suaranya, laporan kas keuangan, dan log audit keamanan pengurus. Hanya daftar anggota OSIS SMKN 1 Bandar asli yang akan dipertahankan.
            </p>
            <button
              type="button"
              onClick={onResetAllData}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-transparent font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset Semua Kegiatan & Keuangan Kas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
