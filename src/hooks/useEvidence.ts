
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEvidenceList(filters: any = {}) {
  return useQuery({
    queryKey: ["evidence", filters],
    queryFn: async () => {
      let q = supabase.from("evidence").select("*").order("uploaded_at", { ascending: false });
      if (filters.q) {
        q = q.ilike("filename", `%${filters.q}%`);
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

export function useEvidenceUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file: File, meta: any }) => {
      const { file, meta } = payload;
      const storagePath = `${crypto.randomUUID()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("evidence").upload(storagePath, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data, error } = await supabase.from("evidence").insert({
        ...meta,
        filename: file.name,
        storage_url: storagePath,
        size: file.size,
      }).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["evidence"] }),
  });
}
