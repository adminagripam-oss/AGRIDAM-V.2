import * as XLSX from 'xlsx';
import { MasterDataKebun } from '@/types/database.types';

export const exportToCSV = (data: MasterDataKebun[], filename: string = 'export') => {
  // Map data to a flat structure suitable for Excel/CSV
  const flattenData = data.map(item => ({
    'CRO': item.cro,
    'Wilayah': item.wilayah,
    'Nama Kebun PT': item.nama_kebun_pt,
    'Nama Kebun Aktual': item.nama_kebun_aktual,
    'Nama Mitra Vendor': item.nama_mitra_vendor,
    'Kode/Tag Kebun': item.kode_tag_kebun,
    'Tahapan': item.tahapan,
    'Status': item.status,
    'Keterangan': item.keterangan,
    'Penjelasan': item.penjelasan,
    'Provinsi': item.provinsi,
    'Kabupaten': item.kabupaten,
    'Luas BA (HO)': item.luas_ba,
    'SHP Awal (HO)': item.luas_shp_awal,
    'HO Planted Inti': item.ho_planted_inti,
    'HO Planted Plasma': item.ho_planted_plasma,
    'HO Planted Masyarakat': item.ho_planted_masyarakat,
    'HO TBM': item.ho_tbm,
    'HO Areal Lain': item.ho_areal_lain,
    'Reg Planted Inti': item.reg_planted_inti,
    'Reg Planted Plasma': item.reg_planted_plasma,
    'Reg Planted Masyarakat': item.reg_planted_masyarakat,
    'Reg TBM': item.reg_tbm,
    'Reg Areal Lain': item.reg_areal_lain,
    'Inti Dikuasai': item.inti_dikuasai,
    'Inti Tidak Dikuasai': item.inti_tidak_dikuasai,
    'Plasma Dikuasai': item.plasma_dikuasai,
    'Plasma Tidak Dikuasai': item.plasma_tidak_dikuasai,
    'Masyarakat Dikuasai': item.masyarakat_dikuasai,
    'Masyarakat Tidak Dikuasai': item.masyarakat_tidak_dikuasai,
    'TBM Dikuasai': item.tbm_dikuasai,
    'TBM Tidak Dikuasai': item.tbm_tidak_dikuasai,
  }));

  const worksheet = XLSX.utils.json_to_sheet(flattenData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Data');
  
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
