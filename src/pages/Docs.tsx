
import React from "react";
const docs = `
# API Overview

- Profiles: /api/profiles (Supabase public.profiles)
- Cases: /api/cases (Supabase public.cases)
- Reports: /api/reports (Supabase public.reports)
- Evidence: /api/evidence (Supabase public.evidence)
- Audit Logs: /api/audit_logs (Supabase public.audit_logs)
- Auth: /auth (Supabase Auth)
- File Storage: Supabase Storage, 'evidence' bucket

Check source for hook usage/tanstack/react-query queries.
`;

export default function DocsPage() {
  return (
    <div className="prose mx-auto px-4 py-8">
      <pre>{docs}</pre>
    </div>
  );
}
