
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Download, AlertTriangle, BarChart3, ClipboardList } from 'lucide-react';

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

  // Quick action configurations with proper government styling
  const quickActions = [
    {
      title: 'Incident Report',
      description: 'Create new incident report',
      icon: AlertTriangle,
      priority: 'primary',
      roles: ['officer', 'investigator', 'supervisor', 'admin'],
      bgColor: 'bg-gov-primary',
      textColor: 'text-white',
      hoverColor: 'hover:bg-gov-primary/90'
    },
    {
      title: 'Investigation Report',
      description: 'Detailed investigation summary',
      icon: FileText,
      priority: 'secondary',
      roles: ['investigator', 'supervisor', 'admin'],
      bgColor: 'bg-gov-secondary',
      textColor: 'text-white',
      hoverColor: 'hover:bg-gov-secondary/90'
    },
    {
      title: 'Statistical Report',
      description: 'Generate statistics report',
      icon: BarChart3,
      priority: 'secondary',
      roles: ['supervisor', 'admin'],
      bgColor: 'bg-gov-action',
      textColor: 'text-white',
      hoverColor: 'hover:bg-gov-action/90'
    },
    {
      title: 'Custom Report',
      description: 'Create custom report template',
      icon: ClipboardList,
      priority: 'tertiary',
      roles: ['investigator', 'supervisor', 'admin'],
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-700',
      hoverColor: 'hover:bg-slate-200'
    }
  ];

  // Filter quick actions based on user role
  const availableActions = quickActions.filter(action => 
    action.roles.includes(user.role)
  );

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        {/* Header with Government Styling */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gov-text">Reports</h1>
            <p className="text-gov-text-secondary">Create and manage incident reports</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 text-white font-medium w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Quick Actions with Professional Government Styling */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gov-text">Report Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.title} 
                  className={`${action.bgColor} ${action.textColor} ${action.hoverColor} transition-all duration-200 cursor-pointer border-0 shadow-gov`}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-3 opacity-90" />
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search with Government Styling */}
        <Card className="gov-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gov-text-secondary w-4 h-4" />
              <Input 
                placeholder="Search reports by title, type, or case number..." 
                className="pl-10 gov-form-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports List with Government Styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockReports.map((report) => (
            <Card key={report.id} className="gov-card hover:shadow-gov-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-gov-text truncate">
                      {report.title}
                    </CardTitle>
                    <p className="text-sm text-gov-text-secondary mt-1">Type: {report.type}</p>
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
                      <span className="text-gov-text-secondary">Case:</span>
                      <span className="font-medium ml-1 text-gov-text">#{report.case_number}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gov-text-secondary">Created by:</span>
                    <span className="font-medium ml-1 text-gov-text">{report.created_by}</span>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary">Date:</span>
                    <span className="font-medium ml-1 text-gov-text">{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button size="sm" className="flex-1 gov-button-primary">View Report</Button>
                  <Button size="sm" variant="outline" className="flex-1 gov-button-secondary">
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
