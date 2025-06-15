
import React, { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Video, File, Search } from "lucide-react";
import { useEvidenceList, useEvidenceUpload } from "@/hooks/useEvidence";
import { logAudit } from "@/hooks/useAuditLog";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

const Evidence = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const { data: evidence, isLoading, error } = useEvidenceList({ q: search });
  const uploadMutation = useEvidenceUpload();
  const fileRef = useRef<HTMLInputElement>(null);

  // ... user/auth checks same ...
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_SIZE) {
        alert("File too large (max 100MB)");
        return;
      }
      const meta = { uploaded_by: profile.id, case_id: null, type: file.type };
      await uploadMutation.mutateAsync({ file, meta });
      await logAudit("Evidence Uploaded", { filename: file.name, size: file.size });
    }
  };

  const getFileIcon = (type: string) => {
    if (type?.includes("image")) return Image;
    if (type?.includes("video")) return Video;
    if (type?.includes("pdf") || type?.includes("text") || type?.includes("doc")) return FileText;
    return File;
  };

  return (
    <MainLayout user={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Evidence Management</h1>
            <p className="text-slate-600">Upload and manage case evidence</p>
          </div>
          <Button
            className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Evidence
          </Button>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search evidence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </CardContent>
        </Card>
        {/* Evidence List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Failed to load evidence</div>
          ) : (
            evidence?.map((ev: any) => {
              const IconComponent = getFileIcon(ev.type);
              return (
                <Card key={ev.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-slate-900 truncate">{ev.filename}</h3>
                        <div className="mt-2 space-y-1 text-sm text-slate-600">
                          <span>Size: {(ev.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <Badge variant="secondary">{ev.type}</Badge>
                        </div>
                        <div>
                          Uploaded by {ev.uploaded_by}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              const url = supabase.storage.from("evidence").getPublicUrl(ev.storage_url).data?.publicUrl;
                              window.open(url, "_blank");
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              const url = supabase.storage.from("evidence").getPublicUrl(ev.storage_url).data?.publicUrl;
                              window.open(url, "_blank");
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Evidence;
