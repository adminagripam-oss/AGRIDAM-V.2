'use client';

import React, { useState, useEffect } from 'react';
import { MasterDataKebun, RequestKebun } from '@/types/database.types';
import { INITIAL_MASTER_DATA, INITIAL_REQUESTS, DEMO_USERS } from '@/lib/mock-data';
import { supabase } from '@/lib/supabaseClient';
import { exportToCSV } from '@/lib/export-utils';
import { Download } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { RequestsTable } from '@/components/RequestsTable';
import { ApprovalComparisonModal } from '@/components/approval-comparison-modal';
import { RejectionModal } from '@/components/rejection-modal';
import { KebunFormModal } from '@/components/kebun-form-modal';

export default function HeadOfficeDashboardPage() {
  const [masterData, setMasterData] = useState<MasterDataKebun[]>(INITIAL_MASTER_DATA);
  const [requestsData, setRequestsData] = useState<RequestKebun[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<'MASTER' | 'REQUESTS'>('MASTER');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingKebun, setEditingKebun] = useState<Partial<MasterDataKebun> | null>(null);

  const [reviewRequest, setReviewRequest] = useState<RequestKebun | null>(null);
  const [rejectRequest, setRejectRequest] = useState<RequestKebun | null>(null);

  useEffect(() => {
    const key = localStorage.getItem('userKey') || 'ho';
    setCurrentUser(DEMO_USERS[key as keyof typeof DEMO_USERS] || DEMO_USERS.ho);

    const storedReqs = localStorage.getItem('requestsData');
    if (storedReqs) setRequestsData(JSON.parse(storedReqs));
    
    const storedMaster = localStorage.getItem('masterData');
    if (storedMaster) setMasterData(JSON.parse(storedMaster));

    // Async sync from Supabase if active
    if (supabase) {
      supabase.from('master_data_kebun').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setMasterData(data as MasterDataKebun[]);
        });

      supabase.from('requests_kebun').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setRequestsData(data as RequestKebun[]);
        });
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('requestsData', JSON.stringify(requestsData));
  }, [requestsData]);
  
  useEffect(() => {
    localStorage.setItem('masterData', JSON.stringify(masterData));
  }, [masterData]);

  if (!currentUser) return null;
  const isRegional = currentUser.role === 'regional';

  const myMasterData = isRegional ? masterData.filter(m => m.wilayah === currentUser.regional_name) : masterData;
  const myRequestsData = isRegional 
    ? requestsData.filter(r => r.wilayah === currentUser.regional_name) 
    : requestsData.filter(r => r.approval_status === 'PENDING');

  const handleDeleteKebun = async (id: string) => {
    setMasterData((prev) => prev.filter((k) => String((k as any).no) !== id && k.id !== id));
    if (supabase) {
      try {
        await supabase.from('master_data_kebun').delete().eq('id', id);
      } catch (e) { console.error('Supabase delete error:', e); }
    }
  };

  const handleSubmitRequest = async (formData: any, isEdit: boolean) => {
    if (isRegional) {
      // Create request
      const newReq: RequestKebun = {
        ...formData,
        id: `req-${Date.now()}`,
        request_type: isEdit ? 'UPDATE' : 'CREATE',
        target_kebun_id: isEdit ? formData.id : null,
        approval_status: 'PENDING',
        requested_by: currentUser.id,
        requested_by_name: currentUser.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setRequestsData(prev => [newReq, ...prev]);
      setActiveTab('REQUESTS');

      if (supabase) {
        try {
          await supabase.from('requests_kebun').insert([{
            request_type: newReq.request_type,
            target_kebun_id: newReq.target_kebun_id,
            approval_status: 'PENDING',
            requested_by: currentUser.id,
            cro: newReq.cro || 'CRO 1',
            wilayah: newReq.wilayah,
            nama_kebun_pt: newReq.nama_kebun_pt || newReq.nama_kebun_aktual,
            nama_kebun_aktual: newReq.nama_kebun_aktual,
            nama_mitra_vendor: newReq.nama_mitra_vendor || '-',
            kode_tag_kebun: newReq.kode_tag_kebun || '-',
            keterangan: newReq.keterangan || '-',
            tahapan: newReq.tahapan || 'Tahap 1',
            status: newReq.status || 'Belum Dikelola',
            penjelasan: newReq.penjelasan || '-',
            luas_ba: newReq.luas_ba || 0,
            luas_shp_awal: newReq.luas_shp_awal || 0,
            ho_planted_inti: newReq.ho_planted_inti || 0,
            ho_planted_plasma: newReq.ho_planted_plasma || 0,
            ho_planted_masyarakat: newReq.ho_planted_masyarakat || 0,
            ho_tbm: newReq.ho_tbm || 0,
            ho_areal_lain: newReq.ho_areal_lain || 0,
            reg_planted_inti: newReq.reg_planted_inti || 0,
            reg_planted_plasma: newReq.reg_planted_plasma || 0,
            reg_planted_masyarakat: newReq.reg_planted_masyarakat || 0,
            reg_tbm: newReq.reg_tbm || 0,
            reg_areal_lain: newReq.reg_areal_lain || 0,
            inti_dikuasai: newReq.inti_dikuasai || 0,
            inti_tidak_dikuasai: newReq.inti_tidak_dikuasai || 0,
            plasma_dikuasai: newReq.plasma_dikuasai || 0,
            plasma_tidak_dikuasai: newReq.plasma_tidak_dikuasai || 0,
            masyarakat_dikuasai: newReq.masyarakat_dikuasai || 0,
            masyarakat_tidak_dikuasai: newReq.masyarakat_tidak_dikuasai || 0,
            tbm_dikuasai: newReq.tbm_dikuasai || 0,
            tbm_tidak_dikuasai: newReq.tbm_tidak_dikuasai || 0,
            provinsi: newReq.provinsi || '-',
            kabupaten: newReq.kabupaten || '-',
            dikelola_inti_luas: newReq.dikelola_inti_luas || 0,
            dikelola_inti_pokok: newReq.dikelola_inti_pokok || 0,
            dikelola_plasma_luas: newReq.dikelola_plasma_luas || 0,
            dikelola_plasma_pokok: newReq.dikelola_plasma_pokok || 0,
            dikelola_masyarakat_luas: newReq.dikelola_masyarakat_luas || 0,
            dikelola_masyarakat_pokok: newReq.dikelola_masyarakat_pokok || 0,
            dikelola_tbm_luas: newReq.dikelola_tbm_luas || 0,
            dikelola_tbm_pokok: newReq.dikelola_tbm_pokok || 0
          }]);
        } catch (e) { console.error('Supabase request insert error:', e); }
      }
    } else {
      // Admin bypass
      if (isEdit) {
        setMasterData(prev => prev.map(m => m.id === formData.id ? { ...m, ...formData } : m));
        if (supabase) {
          try {
            await supabase.from('master_data_kebun').update(formData).eq('id', formData.id);
          } catch (e) { console.error('Supabase update error:', e); }
        }
      } else {
        const newMaster: MasterDataKebun = { ...formData, id: `kebun-${Date.now()}` };
        setMasterData(prev => [newMaster, ...prev]);
        if (supabase) {
          try {
            await supabase.from('master_data_kebun').insert([formData]);
          } catch (e) { console.error('Supabase insert error:', e); }
        }
      }
    }
  };

  const handleApprove = async (req: RequestKebun) => {
    setRequestsData(prev => prev.map(r => r.id === req.id ? { ...r, approval_status: 'APPROVED' } : r));
    
    if (req.request_type === 'CREATE') {
      const newMaster: MasterDataKebun = { ...req, id: `kebun-${Date.now()}` };
      setMasterData(prev => [newMaster, ...prev]);
    } else if (req.request_type === 'UPDATE') {
      setMasterData(prev => prev.map(m => m.id === req.target_kebun_id ? { ...m, ...req } : m));
    }
    setReviewRequest(null);

    if (supabase) {
      try {
        await supabase.from('requests_kebun').update({ approval_status: 'APPROVED' }).eq('id', req.id);
      } catch (e) { console.error('Supabase approve error:', e); }
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setRequestsData(prev => prev.map(r => r.id === id ? { ...r, approval_status: 'REJECTED', rejection_note: reason } : r));
    setRejectRequest(null);
    setReviewRequest(null);

    if (supabase) {
      try {
        await supabase.from('requests_kebun').update({ approval_status: 'REJECTED', rejection_note: reason }).eq('id', id);
      } catch (e) { console.error('Supabase reject error:', e); }
    }
  };

  const handleOpenAdd = () => {
    setEditingKebun(null);
    setIsFormModalOpen(true);
  };
  const handleOpenEdit = (item: any) => {
    setEditingKebun(item);
    setIsFormModalOpen(true);
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Management Kebun {isRegional ? `(${currentUser.regional_name})` : '(Head Office)'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRegional ? 'Kelola data kebun dan ajukan pembaruan.' : 'Kelola data kebun dan review pengajuan dari Regional.'}
          </p>
        </div>
        {!isRegional && (
          <button
            onClick={() => exportToCSV(masterData, 'Export_Master_Data_HO')}
            className="bg-slate-900 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Data (CSV)
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('MASTER')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'MASTER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {isRegional ? 'Master Data Approved' : 'Semua Master Data'}
        </button>
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'REQUESTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {isRegional ? 'Status Pengajuan Saya' : 'Antrean Persetujuan'}
          {myRequestsData.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{myRequestsData.length}</span>
          )}
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'MASTER' ? (
        <DataTable
          data={myMasterData}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onDeleteKebun={handleDeleteKebun}
        />
      ) : (
        <RequestsTable
          data={myRequestsData}
          isRegional={isRegional}
          onReviewRequest={setReviewRequest}
          onApproveRequest={handleApprove}
          onRejectRequest={setRejectRequest}
          onEditRevisi={handleOpenEdit}
        />
      )}

      {/* Modals */}
      <ApprovalComparisonModal
        isOpen={!!reviewRequest}
        request={reviewRequest}
        masterKebun={masterData.find(m => m.id === reviewRequest?.target_kebun_id) || null}
        onClose={() => setReviewRequest(null)}
        onApprove={handleApprove}
        onOpenRejectModal={setRejectRequest}
      />

      <RejectionModal
        isOpen={!!rejectRequest}
        request={rejectRequest}
        onClose={() => setRejectRequest(null)}
        onSubmit={handleReject}
      />

      <KebunFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={(formData) => handleSubmitRequest(formData, !!editingKebun)}
        initialData={editingKebun}
        mode={isRegional ? (editingKebun ? 'UPDATE_REQUEST' : 'CREATE_REQUEST') : (editingKebun ? 'HO_BYPASS_EDIT' : 'HO_BYPASS_ADD')}
        userRole={currentUser.role}
        defaultRegionalName={currentUser.regional_name}
      />
    </div>
  );
}
