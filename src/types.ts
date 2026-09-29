export type ExpenseCategory = 
  | 'Gaji Satpam & Pos Kamling'
  | 'Kebersihan & Angkut Sampah'
  | 'Penerangan Jalan & Listrik'
  | 'Perbaikan Sarana / Jalan'
  | 'Santunan Sosial & Duka Cita'
  | 'Kegiatan Warga / Peringatan Hari Besar'
  | 'Administrasi & Operasional RT';

export type IncomeCategory = 
  | 'Iuran Wajib Bulanan'
  | 'Iuran Sampah & Kebersihan'
  | 'Iuran Keamanan'
  | 'Donasi & Sumbangan Sukarela'
  | 'Sewa Tenda / Inventaris RT'
  | 'Lain-lain';

export interface CashTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  recorder: string;
  paymentMethod?: 'Tunai' | 'Transfer Bank' | 'QRIS';
  receiptNo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Agenda Warga' | 'Keamanan & Ronda' | 'Kesehatan & Posyandu' | 'Kebersihan' | 'Penting / Darurat';
  date: string;
  location?: string;
  author: string;
  isPinned: boolean;
  priority: 'normal' | 'penting' | 'darurat';
  imageUrl?: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  operationalHours: string;
  imageUrl: string;
}

export interface RTConfig {
  rtNumber: string;
  rwNumber: string;
  neighbourhoodName: string;
  villageName: string;
  districtName: string;
  city: string;
  monthlyDuesAmount: number;
  adminPin: string;
}

