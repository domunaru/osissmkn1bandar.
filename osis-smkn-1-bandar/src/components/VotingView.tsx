import React, { useState } from "react";
import { DigitalVote } from "../types";
import { Check, Vote, ShieldAlert, PlusCircle } from "lucide-react";

interface VotingViewProps {
  votes: DigitalVote[];
  currentUser: { name: string; role: string };
  onCastVote: (voteId: string, candidateId: string, userName: string) => void;
  isAdmin: boolean;
  onAddVote: (title: string, description: string, candidates: string[]) => void;
}

export default function VotingView({
  votes,
  currentUser,
  onCastVote,
  isAdmin,
  onAddVote,
}: VotingViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCandidatesText, setNewCandidatesText] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<{ [voteId: string]: string }>({});

  const handleCreateVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCandidatesText.trim()) return;

    const list = newCandidatesText
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    onAddVote(newTitle, newDesc, list);

    setNewTitle("");
    setNewDesc("");
    setNewCandidatesText("");
    setShowAddForm(false);
  };

  const castVote = (voteId: string, candidateId: string) => {
    onCastVote(voteId, candidateId, currentUser.name);
  };

  return (
    <div className="space-y-6" id="voting-panel-container">
      {/* Header controls - Light Themed */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Vote className="h-6 w-6" />
            </div>
            E-Voting Digital OSIS
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Demokrasi jujur dan rahasia. Satu akun siswa hanya diperkenankan menyumbang satu suara murni
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-start md:self-center shadow-sm"
          >
            {showAddForm ? "Tutup Form" : "Buat Sesi Pemilihan"}
          </button>
        )}
      </div>

      {/* Admin setup new poll panel */}
      {showAddForm && (
        <form onSubmit={handleCreateVote} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-slide-down">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Buat Sesi Pemilihan / Polling Siswa</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Sesi Pemilihan
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pemilihan Ketua &amp; Wakil Ketua OSIS Periode 2026/2027"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Deskripsi / Visi Misi Utama
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan petunjuk pemilihan bagi pemilih..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Kandidat Pasangan (Pisahkan dengan tanda koma)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zora &amp; Yuga, Adrian &amp; Dwi, Laura &amp; Arty"
                value={newCandidatesText}
                onChange={(e) => setNewCandidatesText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-450 mt-1.5 font-medium">Sistem otomatis akan mendaftarkan kandidat di atas dengan indeks suara nol.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Simpan &amp; Luncurkan Sesi
            </button>
          </div>
        </form>
      )}

      {/* Poll list feed */}
      <div className="space-y-6" id="voting-sessions-list">
        {votes.map((poll) => {
          const totalVotes = poll.candidates.reduce((acc, curr) => acc + curr.votes, 0);
          const hasVoted = poll.votedUserIds.includes(currentUser.name);

          return (
            <div
              key={poll.id}
              className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-6"
              id={`poll-card-${poll.id}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-105 uppercase tracking-wider">
                    SESI VOTE AKTIF
                  </span>
                  <h3 className="text-sm md:text-base font-extrabold text-slate-900 mt-2">{poll.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1">{poll.description}</p>
                </div>

                <div className="text-left sm:text-right text-xs shrink-0 font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  Total Suara Masuk: <span className="text-blue-600 font-extrabold font-mono">{totalVotes}</span>
                </div>
              </div>

              {/* Candidates Voting Choices Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poll.candidates.map((cand, idx) => {
                  const votePercentage = totalVotes > 0 ? (cand.votes / totalVotes) * 100 : 0;
                  const isChecked = selectedCandidates[poll.id] === cand.id;

                  return (
                    <div
                      key={cand.id}
                      className={`relative p-5 rounded-2xl border transition-all ${
                        hasVoted
                          ? "border-slate-150 bg-slate-50/50"
                          : isChecked
                          ? "border-blue-500 bg-blue-50/40 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 text-xs font-bold text-slate-700 bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200">
                            No. {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{cand.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">Kandidat Terdaftar</p>
                          </div>
                        </div>

                        {/* Vote Button/Indicator */}
                        {!hasVoted ? (
                          <button
                            onClick={() => setSelectedCandidates({ ...selectedCandidates, [poll.id]: cand.id })}
                            className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-blue-600 text-white border-transparent"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        ) : (
                          <div className="text-xs font-extrabold font-mono text-blue-600">
                            {votePercentage.toFixed(1)}%
                          </div>
                        )}
                      </div>

                      {/* Real time results chart slider when user has voted */}
                      {hasVoted && (
                        <div className="mt-4 space-y-1.5">
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                              style={{ width: `${votePercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-450 font-mono font-medium">
                            <span>{cand.votes} suara murni</span>
                            <span>{votePercentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Execute Cast Vote control bar */}
              {!hasVoted ? (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-100 gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Konfirmasi pilihan Anda sebelum menyumbang suara. Keputusan tidak dapat diubah.</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const selectedId = selectedCandidates[poll.id];
                      if (!selectedId) {
                        alert("Silakan pilih pasangan/kandidat terlebih dahulu.");
                        return;
                      }
                      castVote(poll.id, selectedId);
                      alert("✓ SUKSES MELAKUKAN VOTING!\nTerima kasih atas kontribusi jujur Anda dalam demokrasi OSIS.");
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl transition-all shadow shadow-blue-500/10 cursor-pointer self-stretch sm:self-auto text-center"
                  >
                    Kirim Suara Saya
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 px-4 rounded-2xl bg-blue-50 border border-blue-105 text-xs text-blue-700 font-semibold font-sans">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Sistem mendeteksi bahwa akun <strong>{currentUser.name}</strong> telah berkontribusi memberikan suara pada pemilihan ini.</span>
                </div>
              )}
            </div>
          );
        })}

        {votes.length === 0 && (
          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl">
            <p className="text-slate-500 text-xs font-semibold">Belum ada sesi pemilihan atau jajak pendapat digital aktif.</p>
          </div>
        )}
      </div>
    </div>
  );
}
