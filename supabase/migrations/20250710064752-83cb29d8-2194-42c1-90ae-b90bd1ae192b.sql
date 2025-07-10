-- Function to update updated_at column (create first)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false);

-- Create storage policies for evidence files
CREATE POLICY "Evidence files: authenticated users can view" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'evidence' AND auth.role() = 'authenticated');

CREATE POLICY "Evidence files: officers can upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'evidence' AND auth.role() = 'authenticated');

CREATE POLICY "Evidence files: uploaders can update their files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Evidence files: admin can delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'evidence' AND (
  SELECT role FROM profiles WHERE id = auth.uid()
) = 'admin');

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'reported',
  location TEXT NOT NULL,
  description TEXT,
  reported_by TEXT,
  assigned_officer_id UUID REFERENCES public.profiles(id),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  case_id UUID REFERENCES public.cases(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on incidents table
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for incidents
CREATE POLICY "Incidents: authenticated users can view"
ON public.incidents
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Incidents: users can create"
ON public.incidents
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Incidents: creators and assigned officers can update"
ON public.incidents
FOR UPDATE
USING (created_by = auth.uid() OR assigned_officer_id = auth.uid() OR (
  SELECT role FROM profiles WHERE id = auth.uid()
) IN ('admin', 'supervisor'));

CREATE POLICY "Incidents: admin can delete"
ON public.incidents
FOR DELETE
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Create triggers for updated_at
CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();