
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import AuditTable from "@/components/AuditTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AuditTrail = () => {
  const { profile } = useAuth();
  // patch in name field for MainLayout
  const user = profile ? {
    ...profile,
    name: profile.full_name,
  } : null;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!user) return <div>Loading...</div>;
  if (isLoading) return <div>Loading audit logs...</div>;
  if (error) return <div>Failed to load audit logs</div>;

  return (
    <MainLayout user={user}>
      <div className="gov-container max-w-3xl mx-auto py-8">
        <AuditTable audits={data || []} />
      </div>
    </MainLayout>
  )
};
export default AuditTrail;
