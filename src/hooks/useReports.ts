
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useReportsList(filters: any = {}) {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: async () => {
      let q = supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (filters.q) {
        q = q.ilike("title", `%${filters.q}%`);
      }
      if (filters.case_id) {
        q = q.eq("case_id", filters.case_id);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useReportCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("reports").insert(payload).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}
