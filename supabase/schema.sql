-- Isolated schema for CSIR-OPRI & WUSC-Ghana 5-Day Palm Oil Processing & Value Addition Training
-- Table prefix: kboil_

CREATE TABLE IF NOT EXISTS kboil_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE NOT NULL,
    registration_type TEXT NOT NULL DEFAULT 'register', -- 'register' | 'interest'
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age_group TEXT DEFAULT '',
    phone_number TEXT NOT NULL,
    email TEXT DEFAULT '',
    community TEXT NOT NULL,
    occupation TEXT NOT NULL,
    experience_level TEXT NOT NULL DEFAULT 'Beginner',
    focus_interest TEXT DEFAULT 'Modern Palm Oil Processing',
    id_number TEXT DEFAULT '',
    available_all_5_days BOOLEAN NOT NULL DEFAULT true,
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'under_review' | 'confirmed' | 'waitlisted' | 'declined'
    sms_sent BOOLEAN NOT NULL DEFAULT false,
    sms_response TEXT DEFAULT '',
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kboil_registration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES kboil_registrations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    performed_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kboil_reg_number ON kboil_registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_kboil_phone ON kboil_registrations(phone_number);
CREATE INDEX IF NOT EXISTS idx_kboil_status ON kboil_registrations(status);
CREATE INDEX IF NOT EXISTS idx_kboil_type ON kboil_registrations(registration_type);
CREATE INDEX IF NOT EXISTS idx_kboil_created ON kboil_registrations(created_at DESC);

ALTER TABLE kboil_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kboil_registration_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS kboil_public_insert ON kboil_registrations;
CREATE POLICY kboil_public_insert ON kboil_registrations
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS kboil_public_select ON kboil_registrations;
CREATE POLICY kboil_public_select ON kboil_registrations
    FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS kboil_public_update ON kboil_registrations;
CREATE POLICY kboil_public_update ON kboil_registrations
    FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS kboil_public_delete ON kboil_registrations;
CREATE POLICY kboil_public_delete ON kboil_registrations
    FOR DELETE TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS kboil_logs_all ON kboil_registration_logs;
CREATE POLICY kboil_logs_all ON kboil_registration_logs
    FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
