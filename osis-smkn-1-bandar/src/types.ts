export type UserRole = "Admin" | "Pengurus" | "Siswa";

export interface OSISMember {
  name: string;
  role: string; // e.g., "Pembina OSIS", "Ketua OSIS", "Wakil Ketua OSIS", "Sekretaris", "Bendahara", "Koordinator Seksi", "Anggota Seksi", "Siswa"
  section?: string; // e.g., "Keimanan dan Ketakwaan", "Sastra dan Budaya", etc.
  subSection?: string; // e.g., "Islam", "Kristen", "Prestasi Akademik", etc.
  password?: string; // e.g., "zora123"
  avatarStyle: string; // Tailwind background hex card config / initials
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "Sekolah" | "OSIS" | "Rapat" | "Lomba";
  date: string;
  author: string;
  attachmentName?: string;
  attachmentType?: "pdf" | "docx" | "image";
}

export interface OsisEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: "Umum" | "Rapat Internal" | "Lomba" | "Sosialisasi";
  status: "Mendatang" | "Berlangsung" | "Selesai";
  registeredUsers: string[]; // names of registered students
  qrCodeUrl?: string;
  certificateIssued?: boolean;
}

export interface MeetingAttendance {
  id: string;
  meetingTitle: string;
  date: string;
  absensiList: {
    memberName: string;
    role: string;
    timeIn: string;
    status: "Hadir" | "Izin" | "Sakit" | "Alfa";
  }[];
}

export interface StudentAspiration {
  id: string;
  category: "Kritik & Saran" | "Fasilitas" | "Kegiatan" | "Kantin" | "Lainnya";
  text: string;
  date: string;
  isAnonymous: boolean;
  authorName: string;
  status: "Baru" | "Diproses" | "Selesai";
  adminResponse?: string;
  upvotes: number;
}

export interface DigitalVote {
  id: string;
  title: string;
  description: string;
  candidates: {
    id: string;
    name: string;
    vision: string;
    mission: string;
    votes: number;
    avatar?: string;
  }[];
  isActive: boolean;
  votedUserIds: string[]; // List of unique names/passwords to ensure "one student one vote"
}

export interface FinancialRecord {
  id: string;
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  date: string;
  description: string;
  category: "Kas Bulanan" | "Dana Sekolah" | "Sponsor" | "Perlengkapan" | "Konsumsi" | "Hadiah Lomba" | "Dekorasi" | "Lainnya";
  reportedBy: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "Prestasi" | "Informasi" | "Artikel" | "Dokumentasi";
  imageUrl: string;
  author: string;
}

export interface BackupData {
  members: OSISMember[];
  announcements: Announcement[];
  events: OsisEvent[];
  attendance: MeetingAttendance[];
  aspirations: StudentAspiration[];
  votes: DigitalVote[];
  finance: FinancialRecord[];
  news: NewsArticle[];
  logs: AuditLog[];
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  location: string;
  leader: string;
  secretary: string;
  attendeesCount: number;
  content: string;
  decisions: string;
  notes?: string;
  author: string;
}

export interface OsisPiketTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface OsisPiketSchedule {
  id: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  assignees: string[]; // names of OSIS members
  notes?: string;
  tasks: OsisPiketTask[];
}

export interface OsisProker {
  id: string;
  title: string;
  description: string;
  sekbid: string; // e.g. "Seksi Keimanan dan Ketakwaan", "Seksi Budi Pekerti Luhur dan Akhlak Mulia"
  status: "Direncanakan" | "Berjalan" | "Selesai" | "Dibatalkan";
  target: string; // Target audiens / peserta / sasaran proker
  budget: number; // Estimasi anggaran
  date: string; // Target bulan / tanggal pelaksanaan
}

