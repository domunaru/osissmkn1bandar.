import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_MEMBERS } from "../data/osisMembers";
import { OSISMember } from "../types";
import { School, ShieldAlert, KeyRound, User, Briefcase, Eye, EyeOff } from "lucide-react";
import osisLogo from "../assets/images/logo_osis.png";

interface LoginProps {
  onLoginSuccess: (name: string, role: "Admin" | "Pengurus" | "Siswa", member?: OSISMember) => void;
  onBackToHome?: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("Pembina OSIS");
  const [selectedName, setSelectedName] = useState<string>("");
  const [customSiswaName, setCustomSiswaName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const roleGroups = [
    { id: "Pembina OSIS", label: "Pembina OSIS" },
    { id: "Ketua OSIS", label: "Ketua OSIS" },
    { id: "Wakil Ketua OSIS", label: "Wakil Ketua OSIS" },
    { id: "Sekretaris", label: "Sekretaris" },
    { id: "Bendahara", label: "Bendahara" },
    { id: "Koordinator Seksi", label: "Koordinator Seksi" },
    { id: "Anggota Seksi", label: "Anggota Seksi" },
    { id: "Siswa", label: "Siswa Umum (Siswa)" },
  ];

  // Filter roster names based on selectedRoleGroup
  const filteredNames = useMemo(() => {
    if (selectedRoleGroup === "Siswa") return [];
    return INITIAL_MEMBERS.filter((m) => m.role === selectedRoleGroup).map((m) => m.name);
  }, [selectedRoleGroup]);

  // Reset selectedName when role group changes
  React.useEffect(() => {
    if (filteredNames.length > 0) {
      setSelectedName(filteredNames[0]);
    } else {
      setSelectedName("");
    }
    setErrorMsg("");
    setPassword("");
  }, [selectedRoleGroup, filteredNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Siswa Umum handling
    if (selectedRoleGroup === "Siswa") {
      const trimmedName = customSiswaName.trim();
      if (!trimmedName) {
        setErrorMsg("Silakan masukkan nama lengkap Anda.");
        return;
      }
      // Siswa role can login with default password "smkn1bandar*"
      if (password !== "smkn1bandar*") {
        setErrorMsg("Password default untuk Siswa Umum adalah 'smkn1bandar*'.");
        return;
      }
      onLoginSuccess(trimmedName, "Siswa");
      return;
    }

    // Official members check
    const matchedMember = INITIAL_MEMBERS.find(
      (m) => m.role === selectedRoleGroup && m.name === selectedName
    );

    if (!matchedMember) {
      setErrorMsg("Data anggota tidak ditemukan.");
      return;
    }

    if (matchedMember.password !== password) {
      setErrorMsg("Password salah. Gunakan password default: smkn1bandar*");
      return;
    }

    // Determine authorization role
    // Admin: Pembina, Ketua, Wakil, Sekretaris, Bendahara
    // Pengurus: Koordinator, Anggota
    let authRole: "Admin" | "Pengurus" | "Siswa" = "Siswa";
    if (
      ["Pembina OSIS", "Ketua OSIS", "Wakil Ketua OSIS", "Sekretaris", "Bendahara"].includes(
        matchedMember.role
      )
    ) {
      authRole = "Admin";
    } else if (["Koordinator Seksi", "Anggota Seksi"].includes(matchedMember.role)) {
      authRole = "Pengurus";
    }

    onLoginSuccess(matchedMember.name, authRole, matchedMember);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer z-20"
        >
          ← Kembali ke Beranda
        </button>
      )}

      {/* Decorative subtle ambient gradients */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl text-slate-400" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl text-slate-400" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8 bg-white border border-slate-200/85 p-8 rounded-3xl shadow-sm z-10"
        id="login-card-container"
      >
        <div className="text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 shadow-inner overflow-hidden">
            <img
              src={osisLogo}
              alt="Logo OSIS SMKN 1 Bandar"
              className="h-full w-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
            OSIS SMKN 1 BANDAR
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sistem Portal Penyelenggaraan & Transparansi OSIS
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} id="login-form">
          <div className="space-y-4 rounded-md">
            {/* Input 1: Pilihan Jabatan */}
            <div>
              <label htmlFor="role-select" className="block text-xs font-bold uppercase tracking-wider text-slate-650 mb-2">
                Pilihan Jabatan
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  id="role-select"
                  value={selectedRoleGroup}
                  onChange={(e) => setSelectedRoleGroup(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-250 bg-slate-50/50 pl-11 pr-10 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-colors cursor-pointer"
                >
                  {roleGroups.map((rg) => (
                    <option key={rg.id} value={rg.id} className="bg-white text-slate-800">
                      {rg.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Input 2: Nama Anggota / Nama Siswa */}
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-650 mb-2">
                Nama Lengkap
              </label>
              {selectedRoleGroup === "Siswa" ? (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda..."
                    value={customSiswaName}
                    onChange={(e) => setCustomSiswaName(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50/50 pl-11 pr-4 py-3 text-slate-800 placeholder-slate-405 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-colors"
                  />
                </div>
              ) : (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    id="name-select"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-250 bg-slate-50/50 pl-11 pr-10 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-colors cursor-pointer"
                  >
                    {filteredNames.map((name) => (
                      <option key={name} value={name} className="bg-white text-slate-800">
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              )}
            </div>

            {/* Input 3: Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-650">
                  Password Aplikasi
                </label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50/50 pl-11 pr-12 py-3 text-slate-800 placeholder-slate-405 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200/80 p-4 text-xs text-rose-600 font-semibold"
                id="login-error-container"
              >
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all cursor-pointer"
              id="login-btn-submit"
            >
              Masuk ke Portal OSIS
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-550">
            Pembina OSIS: <span className="text-slate-800 font-bold">Janris Pandiangan, S.Kom</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            SMKN 1 Bandar • Tahun Ajaran 2026/2027
          </p>
        </div>
      </motion.div>
    </div>
  );
}
