import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get cases statistics
      const { data: cases, error: casesError } = await supabase
        .from("cases")
        .select("status, priority, created_at");
      
      if (casesError) throw casesError;

      // Get evidence statistics
      const { data: evidence, error: evidenceError } = await supabase
        .from("evidence")
        .select("uploaded_at");
      
      if (evidenceError) throw evidenceError;

      // Get reports statistics
      const { data: reports, error: reportsError } = await supabase
        .from("reports")
        .select("status, created_at");
      
      if (reportsError) throw reportsError;

      // Get incidents statistics
      const { data: incidents, error: incidentsError } = await supabase
        .from("incidents")
        .select("status, priority, created_at");
      
      if (incidentsError) throw incidentsError;

      // Calculate statistics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthCases = cases.filter(c => {
        const caseDate = new Date(c.created_at);
        return caseDate.getMonth() === currentMonth && caseDate.getFullYear() === currentYear;
      });

      const stats = {
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'open' || c.status === 'in-progress').length,
        closedCases: cases.filter(c => c.status === 'closed').length,
        monthlyNewCases: thisMonthCases.length,
        totalEvidence: evidence.length,
        pendingReports: reports.filter(r => r.status === 'draft').length,
        completedReports: reports.filter(r => r.status === 'completed').length,
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter(i => i.status !== 'resolved').length,
        highPriorityIncidents: incidents.filter(i => i.priority === 'high').length,
      };

      return stats;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}