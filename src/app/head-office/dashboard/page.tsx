'use client';

import React, { useState, useEffect } from 'react';
import { MasterDataKebun, RequestKebun } from '@/types/database.types';
import { INITIAL_MASTER_DATA, INITIAL_REQUESTS, DEMO_USERS } from '@/lib/mock-data';
import { DataTable } from '@/components/DataTable';
import { RequestsTable } from '@/components/RequestsTable';
import { ApprovalComparisonModal } from '@/components/approval-comparison-modal';
import { RejectionModal } from '@/components/rejection-modal';
import { KebunFormModal } from '@/components/kebun-form-modal';
import { Button } from '@/components/ui/Button';

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

  const handleDeleteKebun = (id: string) => {
    setMasterData((prev) => prev.filter((k) => String((k as any).no) !== id && k.id !== id));
  };

  const handleSubmitRequest = (formData: any, isEdit: boolean) => {
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
    } else {
      // Admin bypass
      if (isEdit) {
        setMasterData(prev => prev.map(m => m.id === formData.id ? { ...m, ...formData } : m));
      } else {
        setMasterData(prev => [{ ...formData, id: `kebun-${Date.now()}` }, ...prev]);
      }
    }
  };

  const handleApprove = (req: RequestKebun) => {
    setRequestsData(prev => prev.map(r => r.id === req.id ? { ...r, approval_status: 'APPROVED' } : r));
    
    if (req.request_type === 'CREATE') {
      const newMaster: MasterDataKebun = { ...req, id: `kebun-${Date.now()}` };
      setMasterData(prev => [newMaster, ...prev]);
    } else if (req.request_type === 'UPDATE') {
      setMasterData(prev => prev.map(m => m.id === req.target_kebun_id ? { ...m, ...req } : m));
    }
    setReviewRequest(null);
  };

  const handleReject = (id: string, reason: string) => {
    setRequestsData(prev => prev.map(r => r.id === id ? { ...r, approval_status: 'REJECTED', rejection_note: reason } : r));
    setRejectRequest(null);
    setReviewRequest(null);
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
