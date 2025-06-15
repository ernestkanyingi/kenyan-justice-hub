
-- 1. CASES TABLE ---------------------------------------------------------------------------------

CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT,
  assigned_officer_id UUID REFERENCES public.profiles(id),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Only the creator, assigned officer, or admin can SELECT a case
CREATE POLICY "Cases: owner/officer/admin SELECT"
ON public.cases
FOR SELECT
USING (
  created_by = auth.uid()
  OR assigned_officer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only creators or admins can INSERT
CREATE POLICY "Cases: creator/admin INSERT"
ON public.cases
FOR INSERT
WITH CHECK (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only creators, assigned officer, or admins can UPDATE
CREATE POLICY "Cases: update owner/officer/admin"
ON public.cases
FOR UPDATE
USING (
  created_by = auth.uid()
  OR assigned_officer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only creators or admins can DELETE (admin only for delete is recommended)
CREATE POLICY "Cases: admin DELETE"
ON public.cases
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. EVIDENCE TABLE --------------------------------------------------------------------------------

CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) NOT NULL,
  filename TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  storage_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  chain_of_custody JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  description TEXT
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- Only linked case officers, uploaders, or admin can see evidence
CREATE POLICY "Evidence: related users SELECT"
ON public.evidence
FOR SELECT
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.cases 
    WHERE public.cases.id = case_id
      AND (created_by = auth.uid() OR assigned_officer_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only uploader or admin can INSERT
CREATE POLICY "Evidence: uploader/admin INSERT"
ON public.evidence
FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only uploader or admin can UPDATE
CREATE POLICY "Evidence: uploader/admin UPDATE"
ON public.evidence
FOR UPDATE
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admin can DELETE
CREATE POLICY "Evidence: admin DELETE"
ON public.evidence
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. REPORTS TABLE ----------------------------------------------------------------------------------

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  content TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- The creator, assigned officer of case, or admin can SELECT a report
CREATE POLICY "Reports: related users SELECT"
ON public.reports
FOR SELECT
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.cases 
    WHERE public.cases.id = case_id
      AND (created_by = auth.uid() OR assigned_officer_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only creator or admin can INSERT/UPDATE
CREATE POLICY "Reports: creator/admin INSERT"
ON public.reports
FOR INSERT
WITH CHECK (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Reports: creator/admin UPDATE"
ON public.reports
FOR UPDATE
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admin can DELETE
CREATE POLICY "Reports: admin DELETE"
ON public.reports
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. AUDIT LOGS TABLE -----------------------------------------------------------------------------
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins or the user themselves can see their actions/logs
CREATE POLICY "Audit: own or admin SELECT"
ON public.audit_logs
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Any authenticated user can log their own actions
CREATE POLICY "Audit: user INSERT"
ON public.audit_logs
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

-- No update/delete by default for security

-- Indexes for performance (optional, but recommended):
CREATE INDEX IF NOT EXISTS idx_cases_created_by ON public.cases (created_by);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON public.evidence (case_id);
CREATE INDEX IF NOT EXISTS idx_reports_case_id ON public.reports (case_id);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON public.audit_logs (user_id);
