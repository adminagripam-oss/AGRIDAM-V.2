import * as XLSX from 'xlsx';
import { MasterDataKebun } from '@/types/database.types';

export function exportMasterDataToExcel(data: MasterDataKebun[], fileNamePrefix = 'AgriDaM_Master_Data_Kebun') {
  const formattedData = data.map((item, index) => ({
    'No': index + 1,
    'CRO': item.cro,
    'Wilayah': item.wilayah,
    'Nama Kebun/PT': item.nama_kebun_pt,
    'Nama Kebun/PT Aktual di Lapangan': item.nama_kebun_aktual,
    'Nama Mitra/Vendor': item.nama_mitra_vendor || '-',
    'Kode/Tag Kebun': item.kode_tag_kebun,
    'Keterangan': item.keterangan || '-',
    'Tahapan': item.tahapan,
    'Status': item.status,
    'Penjelasan': item.penjelasan || '-',

    // Blok 1: HO Baseline
    'BA (Ha)': item.luas_ba,
    'SHP Awal (Ha)': item.luas_shp_awal,
    'HO Planted Sawit Inti (Ha)': item.ho_planted_inti,
    'HO Planted Sawit Plasma (Ha)': item.ho_planted_plasma,
    'HO Planted Sawit Masy (Ha)': item.ho_planted_masyarakat,
    'HO Total Planted Sawit (Ha)': item.ho_total_planted ?? (item.ho_planted_inti + item.ho_planted_plasma + item.ho_planted_masyarakat),
    'HO TBM (Ha)': item.ho_tbm,
    'HO Areal Lain-lain (Ha)': item.ho_areal_lain,
    'HO Total Areal Verifikasi (Ha)': item.ho_total_verifikasi ?? (item.ho_planted_inti + item.ho_planted_plasma + item.ho_planted_masyarakat + item.ho_tbm + item.ho_areal_lain),
    'Selisih Verifikasi (BA - Verif)': item.selisih_verifikasi ?? (item.luas_ba - (item.ho_total_verifikasi ?? 0)),

    // Blok 2: Verifikasi Regional
    'Reg Planted Sawit Inti (Ha)': item.reg_planted_inti,
    'Reg Planted Sawit Plasma (Ha)': item.reg_planted_plasma,
    'Reg Planted Sawit Masy (Ha)': item.reg_planted_masyarakat,
    'Reg Total Planted Sawit (Ha)': item.reg_total_planted ?? (item.reg_planted_inti + item.reg_planted_plasma + item.reg_planted_masyarakat),
    'Reg TBM (Ha)': item.reg_tbm,
    'Reg Areal Lain-lain (Ha)': item.reg_areal_lain,
    'Reg Total Area (Ha)': item.reg_total_area ?? (item.reg_planted_inti + item.reg_planted_plasma + item.reg_planted_masyarakat + item.reg_tbm + item.reg_areal_lain),

    // Blok 3: Status Penguasaan Areal Planted
    'Inti Dikuasai (Ha)': item.inti_dikuasai,
    'Inti Tidak Dikuasai (Ha)': item.inti_tidak_dikuasai,
    'Plasma Dikuasai (Ha)': item.plasma_dikuasai,
    'Plasma Tidak Dikuasai (Ha)': item.plasma_tidak_dikuasai,
    'Masyarakat Dikuasai (Ha)': item.masyarakat_dikuasai,
    'Masyarakat Tidak Dikuasai (Ha)': item.masyarakat_tidak_dikuasai,
    'TBM Dikuasai (Ha)': item.tbm_dikuasai,
    'TBM Tidak Dikuasai (Ha)': item.tbm_tidak_dikuasai,
    'Total Penguasaan (Ha)': item.total_penguasaan ?? (item.inti_dikuasai + item.inti_tidak_dikuasai + item.plasma_dikuasai + item.plasma_tidak_dikuasai + item.masyarakat_dikuasai + item.masyarakat_tidak_dikuasai + item.tbm_dikuasai + item.tbm_tidak_dikuasai),

    // Blok 4: Lokasi
    'Provinsi': item.provinsi,
    'Kabupaten': item.kabupaten
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Column width definitions
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 10 }, // CRO
    { wch: 18 }, // Wilayah
    { wch: 32 }, // Nama Kebun/PT
    { wch: 32 }, // Nama Kebun Aktual
    { wch: 25 }, // Mitra/Vendor
    { wch: 15 }, // Kode/Tag
    { wch: 25 }, // Keterangan
    { wch: 12 }, // Tahapan
    { wch: 16 }, // Status
    { wch: 35 }, // Penjelasan
    { wch: 12 }, // BA
    { wch: 12 }, // SHP Awal
    { wch: 16 }, // HO Inti
    { wch: 16 }, // HO Plasma
    { wch: 16 }, // HO Masy
    { wch: 18 }, // HO Total Planted
    { wch: 12 }, // HO TBM
    { wch: 16 }, // HO Areal Lain
    { wch: 20 }, // HO Total Verif
    { wch: 20 }, // Selisih Verif
    { wch: 16 }, // Reg Inti
    { wch: 16 }, // Reg Plasma
    { wch: 16 }, // Reg Masy
    { wch: 18 }, // Reg Total Planted
    { wch: 12 }, // Reg TBM
    { wch: 16 }, // Reg Areal Lain
    { wch: 18 }, // Reg Total Area
    { wch: 15 }, // Inti Dik
    { wch: 15 }, // Inti Tdk
    { wch: 15 }, // Plasma Dik
    { wch: 15 }, // Plasma Tdk
    { wch: 15 }, // Masy Dik
    { wch: 15 }, // Masy Tdk
    { wch: 15 }, // TBM Dik
    { wch: 15 }, // TBM Tdk
    { wch: 18 }, // Total Penguasaan
    { wch: 18 }, // Provinsi
    { wch: 22 }  // Kabupaten
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Data V0.5');

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${fileNamePrefix}_${dateStr}.xlsx`);
}
