
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
  const user = profile ? { ...profile, name: profile.full_name } : null;
  const [search, setSearch] = useState("");
  const { data: cases, isLoading, error } = useCasesList({ q: search });
  const createCase = useCaseCreate();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-gov-text-secondary">Loading...</p>
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
    await logAudit("Case Created", payload as any);
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        {/* Header with Government Styling */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gov-text">Case Management</h1>
            <p className="text-gov-text-secondary">Manage and track all active cases</p>
          </div>
          <Button 
            className="gov-button-primary w-full sm:w-auto" 
            onClick={handleCreate} 
            disabled={createCase.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
        
        {/* Search with Government Styling */}
        <Card className="gov-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gov-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search cases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 gov-form-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cases List with Government Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="text-gov-text-secondary">Loading...</div>
          ) : error ? (
            <div className="text-gov-danger">Failed to load cases</div>
          ) : (
            cases?.map((caseItem: any) => (
              <Card key={caseItem.id} className="gov-card hover:shadow-gov-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gov-text truncate">
                      Case #{caseItem.case_number}
                    </CardTitle>
                    <Badge className="ml-2 shrink-0 gov-badge-primary">
                      {caseItem.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gov-text-secondary">Type:</span>
                      <span className="font-medium ml-1 text-gov-text">{caseItem.type}</span>
                    </div>
                    <div>
                      <span className="text-gov-text-secondary">Created:</span>
                      <span className="font-medium ml-1 text-gov-text">
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button size="sm" className="flex-1 gov-button-primary">View Details</Button>
                    <Button size="sm" className="flex-1 gov-button-secondary">Edit</Button>
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
