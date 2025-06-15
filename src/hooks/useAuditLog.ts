
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

// `context` must be typed as `Json`
export async function logAudit(action: string, context: Json = null) {
  try {
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
