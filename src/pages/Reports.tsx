import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Download } from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Detective Sarah Johnson',
  email: 'sarah.johnson@police.gov',
  role: 'investigator' as const,
  badge_number: '4521',
  department: 'Criminal Investigation Division'
};

const Reports = () => {
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

  const mockReports = [
    { id: 1, title: 'Monthly Crime Statistics', type: 'Statistical', status: 'completed', created_by: 'Det. Johnson', created_at: '2024-01-15', case_number: null },
    { id: 2, title: 'Incident Report - Armed Robbery', type: 'Incident', status: 'draft', created_by: 'Officer Smith', created_at: '2024-01-16', case_number: '2024-001' },
    { id: 3, title: 'Investigation Summary', type: 'Investigation', status: 'completed', created_by: 'Det. Brown', created_at: '2024-01-14', case_number: '2024-002' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600">Create and manage incident reports</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium">Incident Report</h3>
              <p className="text-sm text-slate-600">Create new incident report</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium">Investigation Report</h3>
              <p className="text-sm text-slate-600">Detailed investigation summary</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium">Statistical Report</h3>
              <p className="text-sm text-slate-600">Generate statistics report</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium">Custom Report</h3>
              <p className="text-sm text-slate-600">Create custom report template</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search reports by title, type, or case number..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                      {report.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">Type: {report.type}</p>
                  </div>
                  <Badge className={`${getStatusColor(report.status)} ml-2 shrink-0`}>
                    {report.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {report.case_number && (
                    <div>
                      <span className="text-slate-500">Case:</span>
                      <span className="font-medium ml-1">#{report.case_number}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Created by:</span>
                    <span className="font-medium ml-1">{report.created_by}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Date:</span>
                    <span className="font-medium ml-1">{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button size="sm" className="flex-1">View Report</Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
