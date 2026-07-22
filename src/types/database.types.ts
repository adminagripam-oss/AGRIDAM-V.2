export type UserRole = 'ho' | 'regional' | 'executive';

export type RequestType = 'CREATE' | 'UPDATE';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MasterDataKebun {
  id: string;

  // Identifikasi Kebun
  cro: string; // e.g. 'CRO 1', 'CRO 2', etc.
  wilayah: string; // e.g. 'Regional Aceh', 'Regional Sumut 1'
  nama_kebun_pt: string; // Nama legal/administratif
  nama_kebun_aktual: string; // Nama operasional di lapangan
  nama_mitra_vendor: string; // Nama mitra KSO jika ada
  kode_tag_kebun: string; // e.g. 'PT-BPA-01'
  keterangan: string;
  tahapan: string; // 'Tahap 1' s.d. 'Tahap 5'
  status: string; // 'Belum Dikelola' | 'KSO' | 'Kelola Mandiri' | 'Dikelola Sendiri'
  penjelasan: string;

  // Blok 1: Luas Participatory Mapping & Drone (Data HO)
  luas_ba: number; // Berita Acara Satgas PKH
  luas_shp_awal: number; // Shapefile awal
  ho_planted_inti: number;
  ho_planted_plasma: number;
  ho_planted_masyarakat: number;
  ho_total_planted?: number;
  ho_tbm: number;
  ho_areal_lain: number;
  ho_total_verifikasi?: number;
  selisih_verifikasi?: number; // BA - HO Total Verifikasi

  // Blok 2: Verifikasi Regional (Lapangan)
  reg_planted_inti: number;
  reg_planted_plasma: number;
  reg_planted_masyarakat: number;
  reg_total_planted?: number;
  reg_tbm: number;
  reg_areal_lain: number;
  reg_total_area?: number;

  // Blok 3: Status Penguasaan Areal Planted (Dikuasai vs Tidak Dikuasai)
  inti_dikuasai: number;
  inti_tidak_dikuasai: number;
  plasma_dikuasai: number;
  plasma_tidak_dikuasai: number;
  masyarakat_dikuasai: number;
  masyarakat_tidak_dikuasai: number;
  tbm_dikuasai: number;
  tbm_tidak_dikuasai: number;
  total_penguasaan?: number;

  // Blok 4: Lokasi Administratif
  provinsi: string;
  kabupaten: string;

  // Blok 5: Planted Dikelola atau Dipanen
  dikelola_inti_luas?: number;
  dikelola_inti_pokok?: number;
  dikelola_plasma_luas?: number;
  dikelola_plasma_pokok?: number;
  dikelola_masyarakat_luas?: number;
  dikelola_masyarakat_pokok?: number;
  dikelola_tbm_luas?: number;
  dikelola_tbm_pokok?: number;

  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RequestKebun extends MasterDataKebun {
  request_type: RequestType;
  target_kebun_id?: string | null;
  approval_status: ApprovalStatus;
  rejection_note?: string | null;
  requested_by: string;
  requested_by_name?: string;
  reviewed_by?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  regional_name?: string;
  cro_name?: string;
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

export function calculateKebunTotals(data: Partial<MasterDataKebun>): {
  ho_total_planted: number;
  ho_total_verifikasi: number;
  selisih_verifikasi: number;
  reg_total_planted: number;
  reg_total_area: number;
  total_penguasaan: number;
} {
  // HO Totals
  const hoInti = Number(data.ho_planted_inti) || 0;
  const hoPlasma = Number(data.ho_planted_plasma) || 0;
  const hoMasy = Number(data.ho_planted_masyarakat) || 0;
  const ho_total_planted = Number((hoInti + hoPlasma + hoMasy).toFixed(2));

  const hoTbm = Number(data.ho_tbm) || 0;
  const hoLain = Number(data.ho_areal_lain) || 0;
  const ho_total_verifikasi = Number((ho_total_planted + hoTbm + hoLain).toFixed(2));

  const luasBa = Number(data.luas_ba) || 0;
  const selisih_verifikasi = Number((luasBa - ho_total_verifikasi).toFixed(2));

  // Regional Totals
  const regInti = Number(data.reg_planted_inti) || 0;
  const regPlasma = Number(data.reg_planted_plasma) || 0;
  const regMasy = Number(data.reg_planted_masyarakat) || 0;
  const reg_total_planted = Number((regInti + regPlasma + regMasy).toFixed(2));

  const regTbm = Number(data.reg_tbm) || 0;
  const regLain = Number(data.reg_areal_lain) || 0;
  const reg_total_area = Number((reg_total_planted + regTbm + regLain).toFixed(2));

  // Penguasaan Total
  const iDik = Number(data.inti_dikuasai) || 0;
  const iTdk = Number(data.inti_tidak_dikuasai) || 0;
  const pDik = Number(data.plasma_dikuasai) || 0;
  const pTdk = Number(data.plasma_tidak_dikuasai) || 0;
  const mDik = Number(data.masyarakat_dikuasai) || 0;
  const mTdk = Number(data.masyarakat_tidak_dikuasai) || 0;
  const tDik = Number(data.tbm_dikuasai) || 0;
  const tTdk = Number(data.tbm_tidak_dikuasai) || 0;
  const total_penguasaan = Number(
    (iDik + iTdk + pDik + pTdk + mDik + mTdk + tDik + tTdk).toFixed(2)
  );

  return {
    ho_total_planted,
    ho_total_verifikasi,
    selisih_verifikasi,
    reg_total_planted,
    reg_total_area,
    total_penguasaan
  };
}
