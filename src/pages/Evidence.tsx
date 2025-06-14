import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, Video, File, Search } from 'lucide-react';

const Evidence = () => {
  const { profile } = useAuth();

  // Convert profile to the format expected by MainLayout
  const user = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    badge_number: profile.badge_number || undefined,
    department: profile.department || undefined,
  } : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const mockEvidence = [
    { id: 1, filename: 'crime_scene_photo_001.jpg', type: 'Image', size: '2.4 MB', case_number: '2024-001', uploaded_by: 'Det. Johnson', uploaded_at: '2024-01-15' },
    { id: 2, filename: 'witness_statement.pdf', type: 'Document', size: '156 KB', case_number: '2024-002', uploaded_by: 'Officer Smith', uploaded_at: '2024-01-16' },
    { id: 3, filename: 'security_footage.mp4', type: 'Video', size: '45.2 MB', case_number: '2024-001', uploaded_by: 'Det. Johnson', uploaded_at: '2024-01-15' }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Image': return Image;
      case 'Video': return Video;
      case 'Document': return FileText;
      default: return File;
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Evidence Management</h1>
            <p className="text-slate-600">Upload and manage case evidence</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload Evidence
          </Button>
        </div>

        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Evidence Files</h3>
              <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
              <Button variant="outline">Select Files</Button>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search evidence by filename, case number, or type..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evidence List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockEvidence.map((evidence) => {
            const IconComponent = getFileIcon(evidence.type);
            return (
              <Card key={evidence.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 truncate">{evidence.filename}</h3>
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <div className="flex flex-wrap gap-4">
                          <span>Case #{evidence.case_number}</span>
                          <span>{evidence.size}</span>
                          <Badge variant="secondary">{evidence.type}</Badge>
                        </div>
                        <div>
                          Uploaded by {evidence.uploaded_by} on {new Date(evidence.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">View</Button>
                        <Button size="sm" variant="outline" className="flex-1">Download</Button>
                        <Button size="sm" variant="outline" className="flex-1">Chain of Custody</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Evidence;
