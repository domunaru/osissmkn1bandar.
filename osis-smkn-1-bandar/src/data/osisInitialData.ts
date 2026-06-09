import { Announcement, OsisEvent, FinancialRecord, MeetingMinute, OsisPiketSchedule, OsisProker } from "../types";

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Undangan Rapat Koordinasi Program Kerja Triwulan",
    content: "Diberitahukan kepada seluruh koordinator seksi bidang dan pengurus harian inti OSIS SMKN 1 Bandar untuk menghadiri rapat pleno koordinasi program kerja triwulan baru. Kehadiran bersifat wajib bagi seluruh pengurus.",
    date: "2026-03-05",
    category: "Rapat",
    author: "Zora Rizky Salsabila"
  },
  {
    id: "ann-2",
    title: "Pendaftaran Seleksi Ekstrakurikuler Baru Angkatan 2026",
    content: "Pendaftaran bagi siswa-siswi kelas XI yang ingin mendaftar ke unit ekstrakurikuler binaan OSIS mulai dibuka minggu depan. Silakan hubungi koordinator seksi bidang olahraga, seni, atau keagamaan masing-masing.",
    date: "2026-03-04",
    category: "OSIS",
    author: "Sekretariat OSIS"
  },
  {
    id: "ann-3",
    title: "Hasil Rekapitulasi Aspirasi Triwulan I",
    content: "Laporan rekapitulasi aspirasi dan saran siswa yang masuk melalui Kotak Saran Digital kini telah dinilai bersama Kepala Sekolah dan Pembina OSIS. Sebagian besar usulan fasilitas kantin dan UKS segera direalisasikan secara bertahap.",
    date: "2026-03-01",
    category: "OSIS",
    author: "Pembina OSIS"
  }
];

export const INITIAL_EVENTS: OsisEvent[] = [
  {
    id: "ev-1",
    title: "Latihan Dasar Kepemimpinan Mandiri (LDKM)",
    description: "Pembekalan karakter kepemimpinan, kepribadian, tata krama organisasi, dan pemantapan visi misi kerja OSIS SMKN 1 Bandar masa bhakti 2026/2027.",
    date: "2026-03-12",
    location: "Aula Utama SMKN 1 Bandar",
    category: "Sosialisasi",
    status: "Mendatang",
    registeredUsers: []
  },
  {
    id: "ev-2",
    title: "Turnamen Silaturahmi Futsal Kelas (Class Meeting)",
    description: "Kegiatan olahraga persahabatan antar kelas selepas ujian tengah semester untuk mengasah sportivitas, kekompakan, dan kebersamaan.",
    date: "2026-03-18",
    location: "Lapangan Olahraga SMKN 1 Bandar",
    category: "Lomba",
    status: "Mendatang",
    registeredUsers: []
  },
  {
    id: "ev-3",
    title: "Rapat Bulanan Evaluasi Kinerja Pengurus",
    description: "Evaluasi bulanan program kerja seksi bidang dan kearsipan administrasi keuangan kas OSIS agar tetap terkontrol transparan.",
    date: "2026-03-10",
    location: "Ruang Rapat OSIS",
    category: "Rapat Internal",
    status: "Mendatang",
    registeredUsers: []
  }
];

export const INITIAL_FINANCES: FinancialRecord[] = [];

export const INITIAL_MINUTES: MeetingMinute[] = [
  {
    id: "min-1",
    title: "Rapat Pleno Kerja Awal Semester Pembahasan Class Meeting",
    date: "2026-03-02",
    location: "Ruang Kolaborasi OSIS SMKN 1 Bandar",
    leader: "Zora Rizky Salsabila (Ketua OSIS)",
    secretary: "Keysha (Sekretariat OSIS)",
    attendeesCount: 22,
    content: "Rapat koordinasi membahas rancangan teknis pelaksanaan kegiatan Class Meeting pasca Ujian Tengah Semester. Rapat dibuka resmi oleh Pembina OSIS Bapak Janris Pandiangan. Dilanjutkan perumusan rincian cabang olahraga futsal, voli, dan e-sport yang akan dipertandingkan, serta menyepakati besaran kontribusi konsumsi panitia.",
    decisions: "1. Kegiatan Class Meeting dilaksanakan mulai tanggal 18 Maret hingga 22 Maret 2026.\n2. Cabang olahraga resmi adalah Futsal Pa/Pi, Bola Voli Campuran, dan Mobile Legends.\n3. Setiap kelas wajib mengirimkan perwakilan tim dengan koordinasi ketua kelas.\n4. Sistem pengawasan ketat dibantu oleh seksi bidang ketakwaan untuk mencegah potensi gesekan.",
    notes: "Proposal anggaran sebesar Rp1.200.000 diajukan ke wakil kepala sekolah bagian kesiswaan paling lambat akhir minggu ini.",
    author: "Zora Rizky Salsabila"
  },
  {
    id: "min-2",
    title: "Rapat Koordinasi Persiapan LDKM Mandiri 2026",
    date: "2026-02-20",
    location: "Aula Utama SMKN 1 Bandar",
    leader: "Zora Rizky Salsabila (Ketua OSIS)",
    secretary: "Grace Aurelia",
    attendeesCount: 18,
    content: "Rapat pematangan kepanitiaan LDKM Mandiri 2026. Fokus pembahasan mencakup penentuan rute kegiatan outbound, persiapan pemateri kepemimpinan dari unsur guru pembina, penyusunan jadwal acara dari awal hingga akhir, dan pembagian tugas kerja koordinator perlengkapan, konsumsi serta medis.",
    decisions: "1. LDKM Mandiri dilaksanakan pada tanggal 12 Maret 2026 bertempat di Aula Utama dan lapangan luar.\n2. Anggota OSIS baru wajib hadir jam 06:30 WIB dengan atribut seragam organisasi lengkap.\n3. Konsumsi dipesan dari pihak kantin sekolah sejumlah 50 porsi (snack + makan siang).\n4. Dokumentasi ditangani oleh Seksi Bidang Komunikasi dan Informasi.",
    notes: "Dana anggaran sub taktis yang disetujui sekolah adalah Rp1.500.000.",
    author: "Zora Rizky Salsabila"
  }
];

export const INITIAL_PIKET: OsisPiketSchedule[] = [
  {
    id: "piket-senin",
    day: "Senin",
    assignees: ["Zora Rizky Salsabila", "Yuga Febrian"],
    notes: "Piket senin pagi kondusif, beberapa atribut upacara disita sementara",
    tasks: [
      { id: "t-1", name: "Mengecek kebersihan ruang OSIS pagi hari sebelum KBM dimulai", completed: true },
      { id: "t-2", name: "Membantu menertibkan tertib atribut gerbang luar untuk Upacara Bendera", completed: true },
      { id: "t-3", name: "Mengunci pintu dan mematikan saklar AC ruang OSIS sepulang sekolah", completed: false }
    ]
  },
  {
    id: "piket-selasa",
    day: "Selasa",
    assignees: ["Arty Dhynanti", "Laura Garneta Simamora"],
    notes: "Catatan keuangan disinkronisasikan berangkas laci aman",
    tasks: [
      { id: "t-4", name: "Pengecekan proposal kegiatan kelas yang masuk ke laci sekretaris", completed: false },
      { id: "t-5", name: "Merapikan pencatatan laporan buku kas mingguan", completed: true },
      { id: "t-6", name: "Membersihkan debu meja rapat OSIS utama", completed: false }
    ]
  },
  {
    id: "piket-rabu",
    day: "Rabu",
    assignees: ["Adrian Syafi'i", "Dwi Vaneysia"],
    notes: "Mic & sound system telah dirapikan",
    tasks: [
      { id: "t-7", name: "Menyediakan perlengkapan sound system untuk ibadah bersama koordinasi seksi bidang", completed: true },
      { id: "t-8", name: "Membasuh papan tulis dan merapikan spidol ruang rapat", completed: false },
      { id: "t-9", name: "Siaga piket pelayanan di sekretariat OSIS saat jam istirahat kedua", completed: false }
    ]
  },
  {
    id: "piket-kamis",
    day: "Kamis",
    assignees: ["Izhar Sultan Al Furqoon"],
    notes: "Dispenser bersih terisi air penuh, tanaman disiram segar",
    tasks: [
      { id: "t-10", name: "Membersihkan dan mencuci galon dispenser sekretariat", completed: true },
      { id: "t-11", name: "Menyiram tanaman hias di teras pintu depan sekretariat", completed: true },
      { id: "t-12", name: "Pengepakan/arsip ulang berkas fisik di rak kearsipan utama", completed: false }
    ]
  },
  {
    id: "piket-jumat",
    day: "Jumat",
    assignees: ["Zora Rizky Salsabila", "Laura Garneta Simamora"],
    notes: "",
    tasks: [
      { id: "t-13", name: "Pengecekan stok sisa air mineral gelas & snack rapat", completed: false },
      { id: "t-14", name: "Mematikan saklar MCB listrik utama sekretariat OSIS agar aman selama akhir pekan", completed: false }
    ]
  }
];

export const INITIAL_PROKERS: OsisProker[] = [];


