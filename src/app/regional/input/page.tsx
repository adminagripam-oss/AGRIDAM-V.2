'use client';

import React, { useState } from 'react';
import { 
  Building, 
  Edit3, 
  FileSpreadsheet, 
  Sprout, 
  Send 
} from 'lucide-react';
import { 
  MasterDataKebun, 
  RequestKebun, 
  calculateKebunTotals,
  UserProfile 
} from '@/types/database.types';
import { 
  INITIAL_MASTER_DATA, 
  INITIAL_REQUESTS, 
  DEMO_USERS 
} from '@/lib/mock-data';
import { exportMasterDataToExcel } from '@/lib/export-excel';
import { StatsCards } from '@/components/stats-cards';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function RegionalInputPage() {
  const currentUser: UserProfile = DEMO_USERS.aceh || DEMO_USERS.ho;

  const [masterData, setMasterData] = useState<MasterDataKebun[]>(INITIAL_MASTER_DATA);
  const [requests, setRequests] = useState<RequestKebun[]>(INITIAL_REQUESTS);

  const myRegionalName = currentUser.regional_name || 'Regional Aceh';
  const myMasterData = masterData.filter((item) => item.wilayah === myRegionalName);
  const myRequests = requests.filter((req) => req.wilayah === myRegionalName);

  // Form State
  const [formState, setFormState] = useState({
    request_type: 'CREATE' as 'CREATE' | 'UPDATE',
    target_kebun_id: null as string | null,
    cro: currentUser.cro_name || 'CRO 1',
    wilayah: myRegionalName,
    nama_kebun_pt: '',
    nama_kebun_aktual: '',
    nama_mitra_vendor: '',
    kode_tag_kebun: '',
    tahapan: 'Tahap 1',
    status: 'KSO',
    keterangan: '',
    penjelasan: '',
    luas_ba: 0,
    luas_shp_awal: 0,
    ho_planted_inti: 0,
    ho_planted_plasma: 0,
    ho_planted_masyarakat: 0,
    ho_tbm: 0,
    ho_areal_lain: 0,
    reg_planted_inti: 0,
    reg_planted_plasma: 0,
    reg_planted_masyarakat: 0,
    reg_tbm: 0,
    reg_areal_lain: 0,
    inti_dikuasai: 0,
    inti_tidak_dikuasai: 0,
    plasma_dikuasai: 0,
    plasma_tidak_dikuasai: 0,
    masyarakat_dikuasai: 0,
    masyarakat_tidak_dikuasai: 0,
    tbm_dikuasai: 0,
    tbm_tidak_dikuasai: 0,
    provinsi: 'Aceh',
    kabupaten: 'Nagan Raya'
  });

  const totals = calculateKebunTotals(formState as any);

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenEdit = (item: MasterDataKebun) => {
    setFormState({
      request_type: 'UPDATE',
      target_kebun_id: item.id,
      cro: item.cro,
      wilayah: item.wilayah,
      nama_kebun_pt: item.nama_kebun_pt,
      nama_kebun_aktual: item.nama_kebun_aktual,
      nama_mitra_vendor: item.nama_mitra_vendor || '',
      kode_tag_kebun: item.kode_tag_kebun,
      tahapan: item.tahapan,
      status: item.status,
      keterangan: item.keterangan || '',
      penjelasan: item.penjelasan || '',
      luas_ba: item.luas_ba,
      luas_shp_awal: item.luas_shp_awal,
      ho_planted_inti: item.ho_planted_inti,
      ho_planted_plasma: item.ho_planted_plasma,
      ho_planted_masyarakat: item.ho_planted_masyarakat,
      ho_tbm: item.ho_tbm,
      ho_areal_lain: item.ho_areal_lain,
      reg_planted_inti: item.reg_planted_inti,
      reg_planted_plasma: item.reg_planted_plasma,
      reg_planted_masyarakat: item.reg_planted_masyarakat,
      reg_tbm: item.reg_tbm,
      reg_areal_lain: item.reg_areal_lain,
      inti_dikuasai: item.inti_dikuasai,
      inti_tidak_dikuasai: item.inti_tidak_dikuasai,
      plasma_dikuasai: item.plasma_dikuasai,
      plasma_tidak_dikuasai: item.plasma_tidak_dikuasai,
      masyarakat_dikuasai: item.masyarakat_dikuasai,
      masyarakat_tidak_dikuasai: item.masyarakat_tidak_dikuasai,
      tbm_dikuasai: item.tbm_dikuasai,
      tbm_tidak_dikuasai: item.tbm_tidak_dikuasai,
      provinsi: item.provinsi,
      kabupaten: item.kabupaten
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nama_kebun_aktual || !formState.kode_tag_kebun) {
      alert('Mohon isi Nama Kebun dan Kode Tag Kebun.');
      return;
    }

    const { request_type, target_kebun_id, ...restFormState } = formState;

    const newRequest: RequestKebun = {
      id: `req-${Date.now()}`,
      request_type,
      target_kebun_id,
      approval_status: 'PENDING',
      requested_by: currentUser.id,
      requested_by_name: currentUser.full_name,
      ...restFormState,
      ...totals,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setRequests([newRequest, ...requests]);

    // Reset Form
    setFormState({
      request_type: 'CREATE',
      target_kebun_id: null,
      cro: currentUser.cro_name || 'CRO 1',
      wilayah: myRegionalName,
      nama_kebun_pt: '',
      nama_kebun_aktual: '',
      nama_mitra_vendor: '',
      kode_tag_kebun: '',
      tahapan: 'Tahap 1',
      status: 'KSO',
      keterangan: '',
      penjelasan: '',
      luas_ba: 0,
      luas_shp_awal: 0,
      ho_planted_inti: 0,
      ho_planted_plasma: 0,
      ho_planted_masyarakat: 0,
      ho_tbm: 0,
      ho_areal_lain: 0,
      reg_planted_inti: 0,
      reg_planted_plasma: 0,
      reg_planted_masyarakat: 0,
      reg_tbm: 0,
      reg_areal_lain: 0,
      inti_dikuasai: 0,
      inti_tidak_dikuasai: 0,
      plasma_dikuasai: 0,
      plasma_tidak_dikuasai: 0,
      masyarakat_dikuasai: 0,
      masyarakat_tidak_dikuasai: 0,
      tbm_dikuasai: 0,
      tbm_tidak_dikuasai: 0,
      provinsi: 'Aceh',
      kabupaten: 'Nagan Raya'
    });

    alert('Pengajuan permohonan berhasil dikirimkan ke Head Office!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Title & Primary Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pendataan Lapangan ({myRegionalName})
            </h1>
            <Badge variant="dark" size="md" className="font-bold">FORM MAKER</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Formulir pendataan luasan lahan (Ha) & pengajuan permohonan ke Head Office
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => exportMasterDataToExcel(myMasterData, `Master_Data_${myRegionalName}`)}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-700" /> Export Excel
          </Button>
        </div>
      </div>

      {/* KPI Stats Summary */}
      <StatsCards masterDataList={masterData} requestsList={requests} regionalFilter={myRegionalName} />

      {/* REUI 4-CARD FORM */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-slate-900" /> 
              {formState.request_type === 'CREATE' ? 'Form Input Kebun Baru' : 'Form Permohonan Edit Data Kebun'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Isi rincian luasan hektar di bawah. Perhitungan total dilakukan secara realtime.</p>
          </div>
          {formState.request_type === 'UPDATE' && (
            <Button variant="ghost" size="sm" onClick={() => setFormState((prev) => ({ ...prev, request_type: 'CREATE', target_kebun_id: null }))}>
              Reset ke Form Input Baru
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1 */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>1. Informasi Umum & Legalitas Unit Kebun</CardTitle>
                <CardDescription>Kode tag, nama PT legal & operasional, status KSO/Mandiri</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="CRO (Wilayah Operasional)"
                  value={formState.cro}
                  onChange={(e) => handleInputChange('cro', e.target.value)}
                  placeholder="e.g. CRO 1"
                  required
                />
                <Input
                  label="Wilayah Regional"
                  value={formState.wilayah}
                  onChange={(e) => handleInputChange('wilayah', e.target.value)}
                  placeholder="e.g. Regional Aceh"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Kode / Tag Kebun Unik"
                  value={formState.kode_tag_kebun}
                  onChange={(e) => handleInputChange('kode_tag_kebun', e.target.value)}
                  placeholder="e.g. PT-BPA-01"
                  required
                />
                <Select
                  label="Tahapan Penanganan"
                  value={formState.tahapan}
                  onChange={(e) => handleInputChange('tahapan', e.target.value)}
                >
                  <option value="Tahap 1">Tahap 1</option>
                  <option value="Tahap 2">Tahap 2</option>
                  <option value="Tahap 3">Tahap 3</option>
                  <option value="Tahap 4">Tahap 4</option>
                  <option value="Tahap 5">Tahap 5</option>
                </Select>
              </div>

              <Input
                label="Nama Kebun / PT (Aktual Operasional)"
                value={formState.nama_kebun_aktual}
                onChange={(e) => handleInputChange('nama_kebun_aktual', e.target.value)}
                placeholder="e.g. PT Bintang Permata Alue Waki"
                required
              />

              <Input
                label="Nama Kebun / PT (Legal Administratif)"
                value={formState.nama_kebun_pt}
                onChange={(e) => handleInputChange('nama_kebun_pt', e.target.value)}
                placeholder="e.g. PT Bintang Permata Alue Waki"
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Status Pengelolaan"
                  value={formState.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="KSO">KSO (Kerja Sama Operasi)</option>
                  <option value="Kelola Mandiri">Kelola Mandiri</option>
                  <option value="Dikelola Sendiri">Dikelola Sendiri</option>
                  <option value="Belum Dikelola">Belum Dikelola</option>
                </Select>
                <Input
                  label="Mitra / Vendor KSO"
                  value={formState.nama_mitra_vendor}
                  onChange={(e) => handleInputChange('nama_mitra_vendor', e.target.value)}
                  placeholder="e.g. CV Sawit Mandiri"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Provinsi"
                  value={formState.provinsi}
                  onChange={(e) => handleInputChange('provinsi', e.target.value)}
                  placeholder="e.g. Aceh"
                />
                <Input
                  label="Kabupaten"
                  value={formState.kabupaten}
                  onChange={(e) => handleInputChange('kabupaten', e.target.value)}
                  placeholder="e.g. Nagan Raya"
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>2. Verifikasi Area Planted Regional</CardTitle>
                <CardDescription>Rincian hektar tanaman menghasilkan (Sawit Inti, Plasma, Masyarakat)</CardDescription>
              </div>
              <Badge variant="success" size="md">
                Total Planted: {totals.reg_total_planted.toFixed(2)} Ha
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Luas Berita Acara Satgas PKH (HO Baseline)"
                type="number"
                step="0.01"
                unit="Ha"
                value={formState.luas_ba}
                onChange={(e) => handleInputChange('luas_ba', parseFloat(e.target.value) || 0)}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Reg Planted Inti"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.reg_planted_inti}
                  onChange={(e) => handleInputChange('reg_planted_inti', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Reg Planted Plasma"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.reg_planted_plasma}
                  onChange={(e) => handleInputChange('reg_planted_plasma', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Reg Planted Masy"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.reg_planted_masyarakat}
                  onChange={(e) => handleInputChange('reg_planted_masyarakat', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total Reg Planted Sawit:</span>
                  <span className="font-mono text-emerald-700">{totals.reg_total_planted.toFixed(2)} Ha</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3 */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>3. Area Lain-lain & TBM</CardTitle>
                <CardDescription>Tanaman Belum Menghasilkan (TBM) dan areal non-kelapa sawit</CardDescription>
              </div>
              <Badge variant="dark" size="md">
                Total Area: {totals.reg_total_area.toFixed(2)} Ha
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Reg TBM (Tanaman Belum Menghasilkan)"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.reg_tbm}
                  onChange={(e) => handleInputChange('reg_tbm', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Reg Areal Lain-lain / Fasum"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.reg_areal_lain}
                  onChange={(e) => handleInputChange('reg_areal_lain', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-extrabold text-slate-900">
                  <span>TOTAL REGIONAL AREA KEBUN (Planted + TBM + Lain):</span>
                  <span className="font-mono text-sm">{totals.reg_total_area.toFixed(2)} Ha</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4 */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>4. Status Penguasaan Areal Planted</CardTitle>
                <CardDescription>Rincian lahan Dikuasai vs Tidak Dikuasai (klaim/konflik)</CardDescription>
              </div>
              <Badge variant="neutral" size="md">
                Penguasaan: {totals.total_penguasaan.toFixed(2)} Ha
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Inti Dikuasai"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.inti_dikuasai}
                  onChange={(e) => handleInputChange('inti_dikuasai', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Inti Tidak Dikuasai"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.inti_tidak_dikuasai}
                  onChange={(e) => handleInputChange('inti_tidak_dikuasai', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Plasma Dikuasai"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.plasma_dikuasai}
                  onChange={(e) => handleInputChange('plasma_dikuasai', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Plasma Tidak Dikuasai"
                  type="number"
                  step="0.01"
                  unit="Ha"
                  value={formState.plasma_tidak_dikuasai}
                  onChange={(e) => handleInputChange('plasma_tidak_dikuasai', parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="sticky bottom-4 z-30 bg-white p-4 rounded-2xl border border-slate-300 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Siap Mengirimkan Pengajuan Permohonan?</span>
              <span className="text-[11px] text-slate-500">Data akan masuk ke antrean Approval Head Office.</span>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="gap-2">
            <Send className="w-4 h-4" /> Submit Request Permohonan
          </Button>
        </div>
      </form>

      {/* MASTER DATA APPROVED TABLE */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-900" /> Master Data Approved Regional Saya ({myMasterData.length})
          </h2>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white uppercase font-bold">
                <tr>
                  <th className="py-3.5 px-4">No</th>
                  <th className="py-3.5 px-4">Kode Tag & Kebun</th>
                  <th className="py-3.5 px-4">Mitra / Vendor</th>
                  <th className="py-3.5 px-4 text-right">BA (Ha)</th>
                  <th className="py-3.5 px-4 text-right">Planted Inti (Ha)</th>
                  <th className="py-3.5 px-4 text-right">Planted Plasma (Ha)</th>
                  <th className="py-3.5 px-4 text-right text-emerald-400 font-bold">Reg Planted (Ha)</th>
                  <th className="py-3.5 px-4 text-right">TBM & Lain (Ha)</th>
                  <th className="py-3.5 px-4 text-right font-extrabold">Total Area (Ha)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Maker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {myMasterData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 text-sm">
                      Belum ada master data kebun terverifikasi untuk regional ini.
                    </td>
                  </tr>
                ) : (
                  myMasterData.map((item, index) => {
                    const totals = calculateKebunTotals(item);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-500">{index + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{item.kode_tag_kebun}</span>
                          <span className="font-bold text-slate-900">{item.nama_kebun_aktual}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{item.nama_mitra_vendor || '-'}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{item.luas_ba.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{item.reg_planted_inti.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{item.reg_planted_plasma.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 bg-emerald-50">
                          {totals.reg_total_planted.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{(item.reg_tbm + item.reg_areal_lain).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 bg-slate-100">
                          {totals.reg_total_area.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="success">
                            {item.status} ({item.tahapan})
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            className="gap-1 text-[11px]"
                          >
                            <Edit3 className="w-3 h-3 text-slate-800" /> Request Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
