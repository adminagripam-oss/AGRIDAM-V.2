-- ==============================================================================
-- AGRIDAM (AGRINAS DATA MASTER) - MASTER DATA MANAGEMENT PERKEBUNAN SAWIT
-- SUPABASE POSTGRESQL SCHEMA (MATCHING PRD_AgriDaM.md & EXCEL MASTER DATA V0.5)
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE app_role AS ENUM ('ho', 'regional');
CREATE TYPE request_type_enum AS ENUM ('CREATE', 'UPDATE');
CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role app_role NOT NULL DEFAULT 'regional',
    regional_name TEXT, -- e.g., 'Regional Aceh', 'Regional Sumut 1'
    cro_name TEXT, -- e.g., 'CRO 1', 'CRO 2'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MASTER DATA KEBUN (39 COLUMNS MATCHING EXCEL V0.5)
CREATE TABLE IF NOT EXISTS public.master_data_kebun (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identifikasi Kebun
    cro TEXT NOT NULL DEFAULT 'CRO 1',
    wilayah TEXT NOT NULL, -- e.g. 'Regional Aceh'
    nama_kebun_pt TEXT NOT NULL, -- Nama legal/administratif
    nama_kebun_aktual TEXT NOT NULL, -- Nama operasional di lapangan
    nama_mitra_vendor TEXT DEFAULT '-',
    kode_tag_kebun TEXT NOT NULL, -- Kode unik, e.g. 'PT-BPA-01'
    keterangan TEXT DEFAULT '-',
    tahapan TEXT NOT NULL DEFAULT 'Tahap 1', -- 'Tahap 1' s.d. 'Tahap 5'
    status TEXT NOT NULL DEFAULT 'Belum Dikelola', -- 'Belum Dikelola' | 'KSO' | 'Kelola Mandiri' | 'Dikelola Sendiri'
    penjelasan TEXT DEFAULT '-',

    -- Blok 1: Luas Participatory Mapping & Drone (Data HO)
    luas_ba NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    luas_shp_awal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_inti NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_plasma NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_masyarakat NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_total_planted NUMERIC(12, 2) GENERATED ALWAYS AS (
        ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat
    ) STORED,
    ho_tbm NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_areal_lain NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_total_verifikasi NUMERIC(12, 2) GENERATED ALWAYS AS (
        ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat + ho_tbm + ho_areal_lain
    ) STORED,
    selisih_verifikasi NUMERIC(12, 2) GENERATED ALWAYS AS (
        luas_ba - (ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat + ho_tbm + ho_areal_lain)
    ) STORED,

    -- Blok 2: Verifikasi Regional (Lapangan)
    reg_planted_inti NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_planted_plasma NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_planted_masyarakat NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_total_planted NUMERIC(12, 2) GENERATED ALWAYS AS (
        reg_planted_inti + reg_planted_plasma + reg_planted_masyarakat
    ) STORED,
    reg_tbm NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_areal_lain NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_total_area NUMERIC(12, 2) GENERATED ALWAYS AS (
        reg_planted_inti + reg_planted_plasma + reg_planted_masyarakat + reg_tbm + reg_areal_lain
    ) STORED,

    -- Blok 3: Status Penguasaan Areal Planted (Dikuasai vs Tidak Dikuasai)
    inti_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    inti_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    plasma_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    plasma_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    masyarakat_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    masyarakat_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tbm_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tbm_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_penguasaan NUMERIC(12, 2) GENERATED ALWAYS AS (
        inti_dikuasai + inti_tidak_dikuasai + plasma_dikuasai + plasma_tidak_dikuasai +
        masyarakat_dikuasai + masyarakat_tidak_dikuasai + tbm_dikuasai + tbm_tidak_dikuasai
    ) STORED,

    -- Blok 4: Lokasi Administratif
    provinsi TEXT NOT NULL DEFAULT '-',
    kabupaten TEXT NOT NULL DEFAULT '-',

    -- Blok 5: Planted Dikelola atau Dipanen
    dikelola_inti_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_inti_pokok INT NOT NULL DEFAULT 0,
    dikelola_plasma_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_plasma_pokok INT NOT NULL DEFAULT 0,
    dikelola_masyarakat_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_masyarakat_pokok INT NOT NULL DEFAULT 0,
    dikelola_tbm_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_tbm_pokok INT NOT NULL DEFAULT 0,

    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REQUESTS KEBUN (STAGING TABLE MAKER-CHECKER FOR ALL 39 COLUMNS)
CREATE TABLE IF NOT EXISTS public.requests_kebun (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type request_type_enum NOT NULL,
    target_kebun_id UUID REFERENCES public.master_data_kebun(id) ON DELETE SET NULL,
    approval_status approval_status_enum NOT NULL DEFAULT 'PENDING',
    rejection_note TEXT,
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    reviewed_by UUID REFERENCES public.profiles(id),

    -- Identifikasi Kebun
    cro TEXT NOT NULL DEFAULT 'CRO 1',
    wilayah TEXT NOT NULL,
    nama_kebun_pt TEXT NOT NULL,
    nama_kebun_aktual TEXT NOT NULL,
    nama_mitra_vendor TEXT DEFAULT '-',
    kode_tag_kebun TEXT NOT NULL,
    keterangan TEXT DEFAULT '-',
    tahapan TEXT NOT NULL DEFAULT 'Tahap 1',
    status TEXT NOT NULL DEFAULT 'Belum Dikelola',
    penjelasan TEXT DEFAULT '-',

    -- Blok HO
    luas_ba NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    luas_shp_awal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_inti NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_plasma NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_planted_masyarakat NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_total_planted NUMERIC(12, 2) GENERATED ALWAYS AS (
        ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat
    ) STORED,
    ho_tbm NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_areal_lain NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ho_total_verifikasi NUMERIC(12, 2) GENERATED ALWAYS AS (
        ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat + ho_tbm + ho_areal_lain
    ) STORED,
    selisih_verifikasi NUMERIC(12, 2) GENERATED ALWAYS AS (
        luas_ba - (ho_planted_inti + ho_planted_plasma + ho_planted_masyarakat + ho_tbm + ho_areal_lain)
    ) STORED,

    -- Blok Regional
    reg_planted_inti NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_planted_plasma NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_planted_masyarakat NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_total_planted NUMERIC(12, 2) GENERATED ALWAYS AS (
        reg_planted_inti + reg_planted_plasma + reg_planted_masyarakat
    ) STORED,
    reg_tbm NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_areal_lain NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reg_total_area NUMERIC(12, 2) GENERATED ALWAYS AS (
        reg_planted_inti + reg_planted_plasma + reg_planted_masyarakat + reg_tbm + reg_areal_lain
    ) STORED,

    -- Blok Penguasaan
    inti_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    inti_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    plasma_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    plasma_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    masyarakat_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    masyarakat_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tbm_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tbm_tidak_dikuasai NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_penguasaan NUMERIC(12, 2) GENERATED ALWAYS AS (
        inti_dikuasai + inti_tidak_dikuasai + plasma_dikuasai + plasma_tidak_dikuasai +
        masyarakat_dikuasai + masyarakat_tidak_dikuasai + tbm_dikuasai + tbm_tidak_dikuasai
    ) STORED,

    -- Blok Administratif
    provinsi TEXT NOT NULL DEFAULT '-',
    kabupaten TEXT NOT NULL DEFAULT '-',

    -- Blok 5: Planted Dikelola atau Dipanen
    dikelola_inti_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_inti_pokok INT NOT NULL DEFAULT 0,
    dikelola_plasma_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_plasma_pokok INT NOT NULL DEFAULT 0,
    dikelola_masyarakat_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_masyarakat_pokok INT NOT NULL DEFAULT 0,
    dikelola_tbm_luas NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    dikelola_tbm_pokok INT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role app_role,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. APPROVAL TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION process_kebun_request_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.approval_status = 'APPROVED' AND OLD.approval_status = 'PENDING' THEN
        IF NEW.request_type = 'CREATE' THEN
            INSERT INTO public.master_data_kebun (
                cro, wilayah, nama_kebun_pt, nama_kebun_aktual, nama_mitra_vendor, kode_tag_kebun,
                keterangan, tahapan, status, penjelasan,
                luas_ba, luas_shp_awal, ho_planted_inti, ho_planted_plasma, ho_planted_masyarakat, ho_tbm, ho_areal_lain,
                reg_planted_inti, reg_planted_plasma, reg_planted_masyarakat, reg_tbm, reg_areal_lain,
                inti_dikuasai, inti_tidak_dikuasai, plasma_dikuasai, plasma_tidak_dikuasai,
                masyarakat_dikuasai, masyarakat_tidak_dikuasai, tbm_dikuasai, tbm_tidak_dikuasai,
                provinsi, kabupaten, dikelola_inti_luas, dikelola_inti_pokok, dikelola_plasma_luas, dikelola_plasma_pokok, dikelola_masyarakat_luas, dikelola_masyarakat_pokok, dikelola_tbm_luas, dikelola_tbm_pokok, created_by
            ) VALUES (
                NEW.cro, NEW.wilayah, NEW.nama_kebun_pt, NEW.nama_kebun_aktual, NEW.nama_mitra_vendor, NEW.kode_tag_kebun,
                NEW.keterangan, NEW.tahapan, NEW.status, NEW.penjelasan,
                NEW.luas_ba, NEW.luas_shp_awal, NEW.ho_planted_inti, NEW.ho_planted_plasma, NEW.ho_planted_masyarakat, NEW.ho_tbm, NEW.ho_areal_lain,
                NEW.reg_planted_inti, NEW.reg_planted_plasma, NEW.reg_planted_masyarakat, NEW.reg_tbm, NEW.reg_areal_lain,
                NEW.inti_dikuasai, NEW.inti_tidak_dikuasai, NEW.plasma_dikuasai, NEW.plasma_tidak_dikuasai,
                NEW.masyarakat_dikuasai, NEW.masyarakat_tidak_dikuasai, NEW.tbm_dikuasai, NEW.tbm_tidak_dikuasai,
                NEW.provinsi, NEW.kabupaten, NEW.dikelola_inti_luas, NEW.dikelola_inti_pokok, NEW.dikelola_plasma_luas, NEW.dikelola_plasma_pokok, NEW.dikelola_masyarakat_luas, NEW.dikelola_masyarakat_pokok, NEW.dikelola_tbm_luas, NEW.dikelola_tbm_pokok, NEW.requested_by
            );
        ELSIF NEW.request_type = 'UPDATE' AND NEW.target_kebun_id IS NOT NULL THEN
            UPDATE public.master_data_kebun SET
                cro = NEW.cro,
                wilayah = NEW.wilayah,
                nama_kebun_pt = NEW.nama_kebun_pt,
                nama_kebun_aktual = NEW.nama_kebun_aktual,
                nama_mitra_vendor = NEW.nama_mitra_vendor,
                kode_tag_kebun = NEW.kode_tag_kebun,
                keterangan = NEW.keterangan,
                tahapan = NEW.tahapan,
                status = NEW.status,
                penjelasan = NEW.penjelasan,
                luas_ba = NEW.luas_ba,
                luas_shp_awal = NEW.luas_shp_awal,
                ho_planted_inti = NEW.ho_planted_inti,
                ho_planted_plasma = NEW.ho_planted_plasma,
                ho_planted_masyarakat = NEW.ho_planted_masyarakat,
                ho_tbm = NEW.ho_tbm,
                ho_areal_lain = NEW.ho_areal_lain,
                reg_planted_inti = NEW.reg_planted_inti,
                reg_planted_plasma = NEW.reg_planted_plasma,
                reg_planted_masyarakat = NEW.reg_planted_masyarakat,
                reg_tbm = NEW.reg_tbm,
                reg_areal_lain = NEW.reg_areal_lain,
                inti_dikuasai = NEW.inti_dikuasai,
                inti_tidak_dikuasai = NEW.inti_tidak_dikuasai,
                plasma_dikuasai = NEW.plasma_dikuasai,
                plasma_tidak_dikuasai = NEW.plasma_tidak_dikuasai,
                masyarakat_dikuasai = NEW.masyarakat_dikuasai,
                masyarakat_tidak_dikuasai = NEW.masyarakat_tidak_dikuasai,
                tbm_dikuasai = NEW.tbm_dikuasai,
                tbm_tidak_dikuasai = NEW.tbm_tidak_dikuasai,
                provinsi = NEW.provinsi,
                kabupaten = NEW.kabupaten,
                dikelola_inti_luas = NEW.dikelola_inti_luas,
                dikelola_inti_pokok = NEW.dikelola_inti_pokok,
                dikelola_plasma_luas = NEW.dikelola_plasma_luas,
                dikelola_plasma_pokok = NEW.dikelola_plasma_pokok,
                dikelola_masyarakat_luas = NEW.dikelola_masyarakat_luas,
                dikelola_masyarakat_pokok = NEW.dikelola_masyarakat_pokok,
                dikelola_tbm_luas = NEW.dikelola_tbm_luas,
                dikelola_tbm_pokok = NEW.dikelola_tbm_pokok,
                updated_at = NOW()
            WHERE id = NEW.target_kebun_id;
        END IF;

        INSERT INTO public.notifications (user_id, title, message, link)
        VALUES (
            NEW.requested_by,
            'Pengajuan Disetujui (Approved)',
            'Pengajuan data kebun "' || NEW.nama_kebun_aktual || '" telah disetujui oleh Head Office.',
            '/regional/input'
        );
    ELSIF NEW.approval_status = 'REJECTED' AND OLD.approval_status = 'PENDING' THEN
        INSERT INTO public.notifications (user_id, title, message, link)
        VALUES (
            NEW.requested_by,
            'Pengajuan Ditolak (Rejected)',
            'Pengajuan data kebun "' || NEW.nama_kebun_aktual || '" ditolak. Catatan HO: ' || COALESCE(NEW.rejection_note, '-'),
            '/regional/input'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_request_approval_change
AFTER UPDATE ON public.requests_kebun
FOR EACH ROW
EXECUTE FUNCTION process_kebun_request_approval();
