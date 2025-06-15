
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCasesList(filters: any = {}) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: async () => {
      let q = supabase.from("cases").select("*").order("created_at", { ascending: false });
      if (filters.q) {
        q = q.ilike("title", `%${filters.q}%`);
      }
      // Add more filter logic as needed
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCaseCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("cases").insert(payload).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["cases"]),
  });
}

export function useCaseUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: any) => {
      const { data, error } = await supabase.from("cases").update(rest).eq("id", id).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(["cases"]),
  });
}
