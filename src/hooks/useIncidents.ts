import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIncidentsList(filters: any = {}) {
  return useQuery({
    queryKey: ["incidents", filters],
    queryFn: async () => {
      let q = supabase.from("incidents").select("*").order("created_at", { ascending: false });
      if (filters.q) {
        q = q.or(`title.ilike.%${filters.q}%,location.ilike.%${filters.q}%`);
      }
      if (filters.status) {
        q = q.eq("status", filters.status);
      }
      if (filters.priority) {
        q = q.eq("priority", filters.priority);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useIncidentCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("incidents").insert(payload).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useIncidentUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: any) => {
      const { data, error } = await supabase.from("incidents").update(rest).eq("id", id).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useIncidentStats() {
  return useQuery({
    queryKey: ["incident-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("status, priority");
      
      if (error) throw error;

      const stats = {
        total: data.length,
        active: data.filter(i => i.status !== 'resolved').length,
        responding: data.filter(i => i.status === 'responding').length,
        investigating: data.filter(i => i.status === 'investigating').length,
        resolved: data.filter(i => i.status === 'resolved').length,
        highPriority: data.filter(i => i.priority === 'high').length,
      };

      return stats;
    },
  });
}