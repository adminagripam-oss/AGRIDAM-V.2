'use client';

import React, { useState, useEffect } from 'react';
import { FormattedNumberInput } from './FormattedNumberInput';
import { MasterDataKebun, calculateKebunTotals, UserRole } from '@/types/database.types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface KebunFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<MasterDataKebun>) => void;
  initialData?: Partial<MasterDataKebun> | null;
  mode: 'CREATE_REQUEST' | 'UPDATE_REQUEST' | 'HO_BYPASS_ADD' | 'HO_BYPASS_EDIT';
  userRole: UserRole;
  defaultRegionalName?: string;
}

export function KebunFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  userRole,
  defaultRegionalName = 'Regional Aceh'
}: KebunFormModalProps) {
  const [form, setForm] = useState<Partial<MasterDataKebun>>({
    cro: 'CRO 1',
    wilayah: defaultRegionalName,
    nama_kebun_pt: '',
    nama_kebun_aktual: '',
    nama_mitra_vendor: '',
    kode_tag_kebun: '',
    keterangan: '',
    tahapan: 'Tahap 1',
    status: 'Belum Dikelola',
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
    kabupaten: 'Nagan Raya',
    dikelola_inti_luas: 0,
    dikelola_inti_pokok: 0,
    dikelola_plasma_luas: 0,
    dikelola_plasma_pokok: 0,
    dikelola_masyarakat_luas: 0,
    dikelola_masyarakat_pokok: 0,
    dikelola_tbm_luas: 0,
    dikelola_tbm_pokok: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        cro: initialData.cro || 'CRO 1',
        wilayah: initialData.wilayah || defaultRegionalName,
      });
    } else {
      setForm({
        cro: 'CRO 1',
        wilayah: defaultRegionalName,
        nama_kebun_pt: '',
        nama_kebun_aktual: '',
        nama_mitra_vendor: '',
        kode_tag_kebun: '',
        keterangan: '',
        tahapan: 'Tahap 1',
        status: 'Belum Dikelola',
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
        kabupaten: 'Nagan Raya',
        dikelola_inti_luas: 0,
        dikelola_inti_pokok: 0,
        dikelola_plasma_luas: 0,
        dikelola_plasma_pokok: 0,
        dikelola_masyarakat_luas: 0,
        dikelola_masyarakat_pokok: 0,
        dikelola_tbm_luas: 0,
        dikelola_tbm_pokok: 0,
      });
    }
    setErrors({});
  }, [initialData, defaultRegionalName, isOpen]);

  const {
    ho_total_verifikasi,
    selisih_verifikasi,
    reg_total_area,
    total_penguasaan
  } = calculateKebunTotals(form);

  const handleChange = (field: keyof MasterDataKebun, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleNumberChange = (field: keyof MasterDataKebun, val: number) => {
    handleChange(field, isNaN(val) ? 0 : val);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nama_kebun_aktual?.trim()) {
      newErrors.nama_kebun_aktual = 'Nama Kebun Aktual wajib diisi';
    }
    if (userRole === 'ho') {
      if (!form.nama_kebun_pt?.trim()) {
        newErrors.nama_kebun_pt = 'Nama Kebun/PT Administratif wajib diisi';
      }
      if (!form.kode_tag_kebun?.trim()) {
        newErrors.kode_tag_kebun = 'Kode/Tag Kebun wajib diisi (mis. PT-BPA-01)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const getTitle = () => {
    switch (mode) {
      case 'CREATE_REQUEST':
        return 'Form Pendataan Kebun Baru';
      case 'UPDATE_REQUEST':
        return 'Form Request Edit Data Kebun';
      case 'HO_BYPASS_ADD':
        return 'Direct Add Master Data Kebun';
      case 'HO_BYPASS_EDIT':
        return 'Direct Edit Master Data Kebun';
    }
  };

  // Styles defined exactly to force black text on white background inside the Sheet
  const selectClassName = "flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50";
  const inputClassName = "flex h-9 w-full rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50";

  const renderRegionalForm = () => (
    <>
      {/* 1. Penguasaan Areal Planted (Ha) */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">1. Penguasaan Areal Planted (Ha)</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4">
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Nama Kebun/PT Aktual di Lapangan</FieldLabel>
              <input type="text" className={inputClassName} value={form.nama_kebun_aktual} onChange={(e) => handleChange('nama_kebun_aktual', e.target.value)} placeholder="e.g. Kebun Alue Waki" />
              {errors.nama_kebun_aktual && <span className="text-xs text-red-500 mt-1">{errors.nama_kebun_aktual}</span>}
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Nama Mitra/Vendor</FieldLabel>
              <input type="text" className={inputClassName} value={form.nama_mitra_vendor} onChange={(e) => handleChange('nama_mitra_vendor', e.target.value)} placeholder="e.g. CV Aqilah" />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Keterangan</FieldLabel>
              <input type="text" className={inputClassName} value={form.keterangan} onChange={(e) => handleChange('keterangan', e.target.value)} placeholder="e.g. Dalam proses SPK" />
            </Field>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="col-span-full border-b border-slate-200 pb-1 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Inti</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.inti_dikuasai} onChange={(val) => handleNumberChange('inti_dikuasai', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Tidak Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.inti_tidak_dikuasai} onChange={(val) => handleNumberChange('inti_tidak_dikuasai', val)} />
            </Field>
            
            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Plasma</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.plasma_dikuasai} onChange={(val) => handleNumberChange('plasma_dikuasai', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Tidak Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.plasma_tidak_dikuasai} onChange={(val) => handleNumberChange('plasma_tidak_dikuasai', val)} />
            </Field>

            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Masyarakat</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.masyarakat_dikuasai} onChange={(val) => handleNumberChange('masyarakat_dikuasai', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Tidak Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.masyarakat_tidak_dikuasai} onChange={(val) => handleNumberChange('masyarakat_tidak_dikuasai', val)} />
            </Field>

            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">TBM</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.tbm_dikuasai} onChange={(val) => handleNumberChange('tbm_dikuasai', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Tidak Dikuasai</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.tbm_tidak_dikuasai} onChange={(val) => handleNumberChange('tbm_tidak_dikuasai', val)} />
            </Field>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900">
            Total Penguasaan: {total_penguasaan.toFixed(2)} Ha
          </div>
        </FieldGroup>
      </div>

      {/* 2. Wilayah Administrasi */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">2. Wilayah Administrasi</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Provinsi</FieldLabel>
              <input type="text" className={inputClassName} value={form.provinsi} onChange={(e) => handleChange('provinsi', e.target.value)} placeholder="e.g. Aceh" />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Kabupaten</FieldLabel>
              <input type="text" className={inputClassName} value={form.kabupaten} onChange={(e) => handleChange('kabupaten', e.target.value)} placeholder="e.g. Nagan Raya" />
            </Field>
          </div>
        </FieldGroup>
      </div>

      {/* 3. Status & Penjelasan */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">3. Status & Penjelasan</h4>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-slate-900 font-medium">Status</FieldLabel>
            <select className={selectClassName} value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="Belum Dikelola" className="text-slate-900">Belum Dikelola</option>
              <option value="KSO" className="text-slate-900">Kerja Sama Operasi (KSO)</option>
              <option value="Kelola Mandiri" className="text-slate-900">Kelola Mandiri</option>
              <option value="Dikelola Sendiri" className="text-slate-900">Dikelola Sendiri</option>
            </select>
          </Field>
          <Field>
            <FieldLabel className="text-slate-900 font-medium">Penjelasan</FieldLabel>
            <textarea className="flex min-h-[60px] w-full rounded-md border border-slate-300 bg-white text-slate-900 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50" value={form.penjelasan} onChange={(e) => handleChange('penjelasan', e.target.value)} placeholder="Narasi detail kondisi fisik..." />
          </Field>
        </FieldGroup>
      </div>

      {/* 4. Planted Dikelola atau Dipanen */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">4. Planted Dikelola atau Dipanen</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="col-span-full border-b border-slate-200 pb-1 mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Inti</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Luas (Ha)</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_inti_luas} onChange={(val) => handleNumberChange('dikelola_inti_luas', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Jumlah Pokok</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_inti_pokok} onChange={(val) => handleNumberChange('dikelola_inti_pokok', val)} />
            </Field>

            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Plasma</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Luas (Ha)</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_plasma_luas} onChange={(val) => handleNumberChange('dikelola_plasma_luas', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Jumlah Pokok</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_plasma_pokok} onChange={(val) => handleNumberChange('dikelola_plasma_pokok', val)} />
            </Field>

            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Masyarakat</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Luas (Ha)</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_masyarakat_luas} onChange={(val) => handleNumberChange('dikelola_masyarakat_luas', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Jumlah Pokok</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_masyarakat_pokok} onChange={(val) => handleNumberChange('dikelola_masyarakat_pokok', val)} />
            </Field>

            <div className="col-span-full border-b border-slate-200 pb-1 mb-2 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase">TBM</span>
            </div>
            <Field>
              <FieldLabel className="text-slate-900">Luas (Ha)</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_tbm_luas} onChange={(val) => handleNumberChange('dikelola_tbm_luas', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Jumlah Pokok</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.dikelola_tbm_pokok} onChange={(val) => handleNumberChange('dikelola_tbm_pokok', val)} />
            </Field>
          </div>
        </FieldGroup>
      </div>

      {/* 5. Verifikasi Regional (Ha) */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">5. Verifikasi Regional (Ha)</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Planted Sawit Inti</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.reg_planted_inti} onChange={(val) => handleNumberChange('reg_planted_inti', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Planted Sawit Plasma</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.reg_planted_plasma} onChange={(val) => handleNumberChange('reg_planted_plasma', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Planted Sawit Masyarakat</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.reg_planted_masyarakat} onChange={(val) => handleNumberChange('reg_planted_masyarakat', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Total Planted Sawit</FieldLabel>
              <input type="text" className={`${inputClassName} bg-slate-100 font-bold text-slate-800`} disabled value={(
                (Number(form.reg_planted_inti)||0) + 
                (Number(form.reg_planted_plasma)||0) + 
                (Number(form.reg_planted_masyarakat)||0)
              ).toFixed(2)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">TBM</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.reg_tbm} onChange={(val) => handleNumberChange('reg_tbm', val)} />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900 font-medium">Areal Lain-lain</FieldLabel>
              <FormattedNumberInput className={inputClassName} value={form.reg_areal_lain} onChange={(val) => handleNumberChange('reg_areal_lain', val)} />
            </Field>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900">
            Total Area: {reg_total_area.toFixed(2)} Ha
          </div>
        </FieldGroup>
      </div>
    </>
  );

  const renderHOForm = () => (
    <>
      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b border-slate-200 pb-2 text-slate-900">1. Identifikasi & Status Legal</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-slate-900">CRO (Chief Regional Officer)</FieldLabel>
              <select value={form.cro} onChange={(e) => handleChange('cro', e.target.value)} className={selectClassName}>
                {Array.from({ length: 11 }, (_, i) => `CRO ${i + 1}`).map((c) => (
                  <option key={c} value={c} className="text-slate-900">{c}</option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Wilayah Regional</FieldLabel>
              <input type="text" className={inputClassName} value={form.wilayah} onChange={(e) => handleChange('wilayah', e.target.value)} placeholder="e.g. Regional Aceh" />
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Kode / Tag Kebun Unik</FieldLabel>
              <input type="text" className={`${inputClassName} ${errors.kode_tag_kebun ? "border-red-500" : ""}`} value={form.kode_tag_kebun} onChange={(e) => handleChange('kode_tag_kebun', e.target.value)} placeholder="e.g. PT-BPA-01" />
              {errors.kode_tag_kebun && <span className="text-xs text-red-500 mt-1">{errors.kode_tag_kebun}</span>}
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Nama Kebun/PT (Legal)</FieldLabel>
              <input type="text" className={`${inputClassName} ${errors.nama_kebun_pt ? "border-red-500" : ""}`} value={form.nama_kebun_pt} onChange={(e) => handleChange('nama_kebun_pt', e.target.value)} placeholder="e.g. PT Bintang Permata" />
              {errors.nama_kebun_pt && <span className="text-xs text-red-500 mt-1">{errors.nama_kebun_pt}</span>}
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Nama Kebun Aktual</FieldLabel>
              <input type="text" className={`${inputClassName} ${errors.nama_kebun_aktual ? "border-red-500" : ""}`} value={form.nama_kebun_aktual} onChange={(e) => handleChange('nama_kebun_aktual', e.target.value)} placeholder="e.g. Kebun Alue Waki" />
              {errors.nama_kebun_aktual && <span className="text-xs text-red-500 mt-1">{errors.nama_kebun_aktual}</span>}
            </Field>
            <Field>
              <FieldLabel className="text-slate-900">Tahapan Progres</FieldLabel>
              <select value={form.tahapan} onChange={(e) => handleChange('tahapan', e.target.value)} className={selectClassName}>
                {['Tahap 1','Tahap 2','Tahap 3','Tahap 4','Tahap 5'].map(t => <option key={t} value={t} className="text-slate-900">{t}</option>)}
              </select>
            </Field>
          </div>
        </FieldGroup>
      </div>
      
      {/* 2. Baseline Luas HO */}
      <div className="space-y-4">
        <div className="flex justify-between border-b border-slate-200 pb-2 items-center">
          <h4 className="font-semibold text-sm text-slate-900">2. Baseline Luas HO (Ha)</h4>
          <span className="text-xs text-slate-500 font-mono">HO Verif: {ho_total_verifikasi.toFixed(2)} | Selisih: {selisih_verifikasi.toFixed(2)}</span>
        </div>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field><FieldLabel className="text-slate-900">Luas BA Satgas PKH</FieldLabel><FormattedNumberInput className={inputClassName} value={form.luas_ba} onChange={(val) => handleNumberChange('luas_ba', val)} /></Field>
            <Field><FieldLabel className="text-slate-900">Luas SHP Awal</FieldLabel><FormattedNumberInput className={inputClassName} value={form.luas_shp_awal} onChange={(val) => handleNumberChange('luas_shp_awal', val)} /></Field>
            <Field><FieldLabel className="text-slate-900">HO Planted Sawit Inti</FieldLabel><FormattedNumberInput className={inputClassName} value={form.ho_planted_inti} onChange={(val) => handleNumberChange('ho_planted_inti', val)} /></Field>
            <Field><FieldLabel className="text-slate-900">HO Planted Sawit Plasma</FieldLabel><FormattedNumberInput className={inputClassName} value={form.ho_planted_plasma} onChange={(val) => handleNumberChange('ho_planted_plasma', val)} /></Field>
          </div>
        </FieldGroup>
      </div>

      {/* 3. Verifikasi Regional & 4. Status Penguasaan (Simplified for HO view to avoid duplicating all 50 fields, just reusing the regional ones internally) */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-500 mt-4">
        Catatan: Sebagai Admin HO, form ini hanya difokuskan pada Baseline awal. Data aktual lapangan diperbarui oleh Regional.
      </div>
    </>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white border-l border-slate-200 shadow-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-slate-900">{getTitle()}</SheetTitle>
          <SheetDescription className="text-slate-500">
            {userRole === 'regional' 
              ? 'Isi formulir berikut dengan data fisik aktual kebun dan wilayah administrasi.' 
              : 'Konfirmasi atau perbarui master data dari tingkat pusat.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="py-6 space-y-8">
          {userRole === 'regional' ? renderRegionalForm() : renderHOForm()}

          <SheetFooter className="mt-8 pt-4 border-t border-slate-200">
            <SheetClose asChild>
              <Button variant="outline" type="button" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
              {mode.startsWith('HO') ? 'Simpan Master Data' : 'Submit Request Kebun'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
