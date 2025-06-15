import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Filter } from "lucide-react";
import { useCasesList, useCaseCreate, useCaseUpdate } from "@/hooks/useCases";
import { logAudit } from "@/hooks/useAuditLog";

const Cases = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const { data: cases, isLoading, error } = useCasesList({ q: search });
  const createCase = useCaseCreate();

  // Convert profile to the format expected by MainLayout
  const user = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    badge_number: profile.badge_number || undefined,
    department: profile.department || undefined,
  } : null;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    const payload = {
      case_number: `LEC-${Date.now()}`,
      title: "New Case",
      type: "Other",
      created_by: profile.id,
      status: "open",
    };
    await createCase.mutateAsync(payload);
    await logAudit("Case Created", { ...payload });
  };

  return (
    <MainLayout user={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Case Management</h1>
            <p className="text-slate-600">Manage and track all active cases</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto" onClick={handleCreate} disabled={createCase.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {/* Add filter component here as needed */}
            </div>
          </CardContent>
        </Card>
        {/* Cases List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Failed to load cases</div>
          ) : (
            cases?.map((caseItem: any) => (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                      Case #{caseItem.case_number}
                    </CardTitle>
                    <Badge className="ml-2 shrink-0">{caseItem.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* ... Display type, assigned, created ... */}
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="font-medium ml-1">{caseItem.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Created:</span>
                    <span className="font-medium ml-1">
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button size="sm" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cases;
