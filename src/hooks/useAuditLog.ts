
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export async function logAudit(action: string, context: object = {}) {
  try {
    // You can fetch profile if needed, or use user_id from session
    const { profile } = useAuth();
    if (!profile) return;
    await supabase.from("audit_logs").insert({
      user_id: profile.id,
      action,
      context,
      ip_address: null,
    });
  } catch (e) {
    console.warn("Audit log failed", e);
  }
}
