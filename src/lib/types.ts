export type UserRole = 'ho' | 'regional';

export type RequestType = 'CREATE' | 'UPDATE';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  regional_name?: string;
}

export interface KebunFields {
  regional_name: string;
  nama_kebun_aktual: string;
  nama_mitra_vendor: string;
  status: string; // 'Aktif' | 'Kerjasama' | 'Restrukturisasi'
  keterangan: string;
  penjelasan: string;

  // Area Planted (Hektar)
  planted_sawit_inti: number;
  planted_sawit_plasma: number;
  planted_sawit_masyarakat: number;
  total_planted_sawit?: number; // Calculated

  // Area Lain-lain (Hektar)
  tbm_tanaman_belum_menghasilkan: number;
  areal_lain_lain: number;
  total_lain_lain?: number; // Calculated

  // Total Keseluruhan (Calculated)
  total_area?: number;

  // Status Penguasaan Lahan (Hektar)
  inti_dikuasai: number;
  inti_tidak_dikuasai: number;
  plasma_dikuasai: number;
  plasma_tidak_dikuasai: number;
  masyarakat_dikuasai: number;
  masyarakat_tidak_dikuasai: number;
  tbm_dikuasai: number;
  tbm_tidak_dikuasai: number;
}

export interface KebunMasterData extends KebunFields {
  id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface KebunRequest extends KebunFields {
  id: string;
  request_type: RequestType;
  target_kebun_id?: string | null;
  approval_status: ApprovalStatus;
  rejection_note?: string | null;
  requested_by: string;
  requested_by_name?: string;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string | null;
  target_role?: UserRole | null;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

// Utility to calculate totals safely
export function calculateKebunTotals(data: Partial<KebunFields>): {
  total_planted_sawit: number;
  total_lain_lain: number;
  total_area: number;
} {
  const inti = Number(data.planted_sawit_inti) || 0;
  const plasma = Number(data.planted_sawit_plasma) || 0;
  const masyarakat = Number(data.planted_sawit_masyarakat) || 0;
  const total_planted_sawit = Number((inti + plasma + masyarakat).toFixed(2));

  const tbm = Number(data.tbm_tanaman_belum_menghasilkan) || 0;
  const lain = Number(data.areal_lain_lain) || 0;
  const total_lain_lain = Number((tbm + lain).toFixed(2));

  const total_area = Number((total_planted_sawit + total_lain_lain).toFixed(2));

  return { total_planted_sawit, total_lain_lain, total_area };
}
