import React, { useState } from "react";
import { FinancialRecord } from "../types";
import { Landmark, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Search, PlusCircle, Download, Calendar, HelpCircle, Check, RotateCcw } from "lucide-react";

interface KeuanganViewProps {
  finances: FinancialRecord[];
  isAdmin: boolean;
  onAddTransaction: (item: Omit<FinancialRecord, "id" | "date" | "reportedBy">) => void;
  onResetFinances: () => void;
  currentUser: { name: string; role: string };
}

export default function KeuanganView({
  finances,
  isAdmin,
  onAddTransaction,
  onResetFinances,
  currentUser,
}: KeuanganViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [subTab, setSubTab] = useState<"transaksi" | "rekap">("transaksi");

  // Form states
  const [newType, setNewType] = useState<FinancialRecord["type"]>("Pemasukan");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newCategory, setNewCategory] = useState<FinancialRecord["category"]>("Kas Bulanan");
  const [newDesc, setNewDesc] = useState("");

  const totalIncome = finances
    .filter((f) => f.type === "Pemasukan")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = finances
    .filter((f) => f.type === "Pengeluaran")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredLogs = finances.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "Semua" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0 || !newDesc.trim()) return;

    onAddTransaction({
      type: newType,
      amount: newAmount,
      category: newCategory,
      description: newDesc,
    });

    setNewAmount(0);
    setNewDesc("");
    setShowAddForm(false);
    alert("✓ SUKSES MENCATAT TRANSAKSI!\nCatatan finansial berhasil disimpan ke dalam buku kas OSIS.");
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Monthly recap logic
  const getMonthlyRecap = () => {
    const monthsMap: {
      [key: string]: {
        monthKey: string;
        income: number;
        expense: number;
        transactionsCount: number;
      };
    } = {};

    finances.forEach((record) => {
      // Date format is "YYYY-MM-DD" style or alternative. Let's extract year & month.
      // E.g. "2026-05-24" or corresponding.
      let monthLabel = "Lainnya";
      if (record.date && record.date.includes("-")) {
        const parts = record.date.split("-");
        const year = parts[0];
        const monthNumber = parts[1];
        
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const monthIndex = parseInt(monthNumber, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthLabel = `${monthNames[monthIndex]} ${year}`;
        } else {
          monthLabel = `${monthNumber}/${year}`;
        }
      } else {
        // Fallback for standard string
        monthLabel = record.date ? record.date.substring(0, 7) : "Kas Umum";
      }

      if (!monthsMap[monthLabel]) {
        monthsMap[monthLabel] = {
          monthKey: monthLabel,
          income: 0,
          expense: 0,
          transactionsCount: 0,
        };
      }

      const val = monthsMap[monthLabel];
      val.transactionsCount += 1;
      if (record.type === "Pemasukan") {
        val.income += record.amount;
      } else {
        val.expense += record.amount;
      }
    });

    return Object.values(monthsMap);
  };

  const monthlyRecapData = getMonthlyRecap();

  const handleExportCSV = () => {
    const headers = "ID,Tanggal,Tipe,Kategori,Deskripsi,Jumlah,Pelapor\n";
    const rows = finances
      .map((f) => `${f.id},${f.date},${f.type},${f.category},"${f.description}",${f.amount},${f.reportedBy}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Keuangan_OSIS_SMKN1_Bandar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("✓ SUKSES EKSPOR DATA!\nFile Excel (CSV) laporan keuangan OSIS berhasil diunduh.");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="keuangan-container">
      {/* Top Ledger Overview Cards - Fully accessible light themes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="ledger-summary-row">
        {/* Total balance card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-50 rounded-bl-full -z-10 opacity-60" />
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
            <span>Saldo Kas Bersih</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatIDR(balance)}</p>
          <p className="text-[10px] text-slate-450 mt-2 font-medium font-sans">Pertanggungjawaban real-time transparan</p>
        </div>

        {/* Total incomes card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-50 rounded-bl-full -z-10 opacity-60" />
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
            <span>Pemasukan Terkumpul</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 tracking-tight">{formatIDR(totalIncome)}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-605 mt-2 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Rekapitulasi iuran &amp; dana masuk</span>
          </div>
        </div>

        {/* Total expense card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 bg-rose-50 rounded-bl-full -z-10 opacity-60" />
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
            <span>Dana Pengeluaran</span>
            <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 tracking-tight">{formatIDR(totalExpense)}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-rose-605 mt-2 font-semibold">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Alokasi perlengkapan &amp; kegiatan</span>
          </div>
        </div>
      </div>

      {/* Main control panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Landmark className="h-6 w-6" />
            </div>
            Transparansi Alokasi Dana OSIS
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Laporan pertanggungjawaban kas transparan bagi seluruh anggota dan siswa SMKN 1 Bandar
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          {/* Sub Navigation Tabs inside Keuangan: Rincian Transaksi vs Rekap Bulanan */}
          <div className="bg-slate-50 p-1 rounded-xl border border-slate-200 flex gap-1">
            <button
              onClick={() => setSubTab("transaksi")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                subTab === "transaksi"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Rincian Transaksi
            </button>
            <button
              onClick={() => setSubTab("rekap")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                subTab === "rekap"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Satu Bulan Sekali Rekap
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            Ekspor Excel (CSV)
          </button>

          {/* Reset Saldo holds strict Admin check only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                const confirmReset = window.confirm(
                  "⚠ PERINGATAN ⚠\n\nApakah Anda yakin ingin mereset seluruh saldo kas keuangan OSIS kembali ke nol (Rp 0)?\nTindakan ini akan menghapus semua catatan transaksi kas secara permanen!"
                );
                if (confirmReset) {
                  onResetFinances();
                  alert("✓ SUKSES MERESET SALDO!\nSaldo kas keuangan OSIS berhasil dikembalikan ke Rp 0.");
                }
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Saldo
            </button>
          )}

          {/* Both Admin and Pengurus (all users with Keuangan access) are authorised to add financial entries */}
          <button
            onClick={() => {
              setNewType("Pemasukan");
              setNewCategory("Kas Bulanan");
              setShowAddForm(showAddForm && newType === "Pemasukan" ? false : true);
            }}
            className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              showAddForm && newType === "Pemasukan"
                ? "bg-slate-700 hover:bg-slate-600 shadow-slate-100"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-100"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm && newType === "Pemasukan" ? "Tutup Form Pemasukan" : "+ Tambah Pemasukan OSIS"}
          </button>

          <button
            onClick={() => {
              setNewType("Pengeluaran");
              setNewCategory("Perlengkapan");
              setShowAddForm(showAddForm && newType === "Pengeluaran" ? false : true);
            }}
            className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              showAddForm && newType === "Pengeluaran"
                ? "bg-slate-700 hover:bg-slate-600 shadow-slate-100"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-100"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm && newType === "Pengeluaran" ? "Tutup Form Pengeluaran" : "- Catat Belanja/Pengeluaran"}
          </button>
        </div>
      </div>

      {/* Add record form collapse panel with dynamic theme color styles */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className={`p-6 bg-white rounded-3xl border-2 shadow-md space-y-4 animate-slide-down transition-all ${
            newType === "Pemasukan"
              ? "border-emerald-200 ring-4 ring-emerald-500/5"
              : "border-blue-200 ring-4 ring-blue-500/5"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <h3
              className={`font-black text-xs uppercase tracking-wider flex items-center gap-2 ${
                newType === "Pemasukan" ? "text-emerald-700" : "text-blue-700"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  newType === "Pemasukan" ? "bg-emerald-500 animate-pulse" : "bg-blue-500 animate-pulse"
                }`}
              />
              {newType === "Pemasukan" ? "FORM ENTRI PEMASUKAN OSIS BARU (UANG MASUK)" : "FORM CATAT PENGELUARAN OSIS BARU"}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                newType === "Pemasukan" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}
            >
              {newType === "Pemasukan" ? "Kas Bertambah" : "Kas Berkurang"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Tipe Alokasi
              </label>
              <select
                value={newType}
                onChange={(e) => {
                  const type = e.target.value as FinancialRecord["type"];
                  setNewType(type);
                  // Default categories
                  if (type === "Pemasukan") setNewCategory("Kas Bulanan");
                  else setNewCategory("Perlengkapan");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Pemasukan">Pemasukan (Uang Masuk)</option>
                <option value="Pengeluaran">Pengeluaran (Uang Keluar)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Kategori Transaksi
              </label>
              {newType === "Pemasukan" ? (
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FinancialRecord["category"])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Kas Bulanan">Kas Bulanan Anggota</option>
                  <option value="Dana Sekolah">Dana Sekolah (APBS)</option>
                  <option value="Sponsor">Sponsor & Donasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              ) : (
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FinancialRecord["category"])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Perlengkapan">Perlengkapan & Logistik</option>
                  <option value="Konsumsi">Konsumsi Peserta / Panitia</option>
                  <option value="Hadiah Lomba">Hadiah & Juara Lomba</option>
                  <option value="Dekorasi">Dekorasi & Dokumentasi</option>
                  <option value="Lainnya">Lainnya Umum</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Jumlah Anggaran (IDR)
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="20000"
                value={newAmount || ""}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className={`w-full rounded-xl border p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 ${
                  newType === "Pemasukan" ? "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Catatan / Deskripsi Penjelas
            </label>
            <input
              type="text"
              required
              placeholder={
                newType === "Pemasukan"
                  ? "e.g. Pembayaran iuran kas bulanan pengurus gelombang pertama"
                  : "e.g. Pembelian piagam penghargaan juara Lomba Futsal Antar Kelas"
              }
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className={`w-full rounded-xl border p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 ${
                newType === "Pemasukan" ? "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white text-xs font-black rounded-xl transition-all shadow-md ${
                newType === "Pemasukan"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-50"
                  : "bg-blue-600 hover:bg-blue-550 shadow-blue-50"
              }`}
            >
              {newType === "Pemasukan" ? "✓ Simpan Tunai Pemasukan" : "✓ Simpan Transaksi Kas"}
            </button>
          </div>
        </form>
      )}

      {/* Conditionally render TRANSACTIONS LIST vs MONTHLY RECAP */}
      {subTab === "transaksi" ? (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden" id="ledger-table-container">
          {/* Table filtering settings */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-56 pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-250 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="font-semibold text-[11px] uppercase tracking-wider mr-1 text-slate-450">Filter Tipe:</span>
              {["Semua", "Pemasukan", "Pengeluaran"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    filterType === t
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-500 border border-slate-200 hover:text-slate-850"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[9.5px] font-extrabold">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Tipe</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4 text-right">Jumlah</th>
                  <th className="p-4">Pelapor/Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                {filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-500 font-mono font-medium">{item.date}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          item.type === "Pemasukan"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-500 font-medium">{item.category}</td>
                    <td className="p-4 max-w-xs font-semibold text-slate-800">{item.description}</td>
                    <td
                      className={`p-4 text-right font-bold font-mono text-xs ${
                        item.type === "Pemasukan" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {item.type === "Pemasukan" ? "+" : "-"} {formatIDR(item.amount)}
                    </td>
                    <td className="p-4 text-slate-500 truncate max-w-[120px] font-medium">{item.reportedBy}</td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                      Belum ada rekaman sirkulasi kas terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* REKAP BULANAN PANEL - Groups into professional month-by-month items as requested */
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4" id="monthly-recap-panel">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-blue-600" />
                Jurnal Rekapitulasi Kas Per Bulan
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Buku pembantu kas disaring otomatis sebulan sekali untuk evaluasi kinerja sirkulasi keuangan</p>
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-100 p-2 rounded-xl">
              Iuran Anggota Ter-audit
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[9.5px] font-extrabold">
                  <th className="p-4">Periode Bulan</th>
                  <th className="p-4">Jumlah Transaksi</th>
                  <th className="p-4 text-emerald-600">Total Pemasukan</th>
                  <th className="p-4 text-rose-605">Total Pengeluaran</th>
                  <th className="p-4 text-right">Saldo Bersih (Selisih)</th>
                  <th className="p-4">Status Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                {monthlyRecapData.map((recap, i) => {
                  const netDiff = recap.income - recap.expense;
                  const isSurplus = netDiff >= 0;

                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-extrabold text-slate-900 text-xs md:text-sm">{recap.monthKey}</td>
                      <td className="p-4 text-slate-500 font-mono font-medium">{recap.transactionsCount} transaksi catat</td>
                      <td className="p-4 font-bold font-mono text-emerald-600">+{formatIDR(recap.income)}</td>
                      <td className="p-4 font-bold font-mono text-rose-600">-{formatIDR(recap.expense)}</td>
                      <td className="p-4 text-right font-black font-mono text-slate-900">
                        {isSurplus ? "+" : ""} {formatIDR(netDiff)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                            isSurplus
                              ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                              : "bg-rose-50 text-rose-700 border-rose-150"
                          }`}
                        >
                          {isSurplus ? "🟢 Surplus" : "🔴 Defisit"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {monthlyRecapData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                      Sistem belum mendeteksi data kas bulanan untuk direkap.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex items-start gap-2.5 mt-4">
            <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-500 leading-normal font-sans font-medium">
              <strong>Bagaimana rekap bulanan ini bekerja?</strong> Setiap transaksi Pemasukan (iuran kas bulanan, dana APBS sekolah, sponsor) dan Pengeluaran (logistik rapat, belanja Lomba) dikumpulkan dan dikelompokkan berdasarkan bulan secara otomatis. Memudahkan pengurus mendeteksi apakah alur dana bulanan tersebut mengalami surplus sehat atau defisit belanja.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
