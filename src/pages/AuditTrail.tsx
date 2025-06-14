
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { History, Search, Download, User, FileText, Shield } from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Detective Sarah Johnson',
  email: 'sarah.johnson@police.gov',
  role: 'investigator' as const,
  badge_number: '4521',
  department: 'Criminal Investigation Division'
};

const AuditTrail = () => {
  const mockAuditLogs = [
    { id: 1, action: 'Case Created', user: 'Det. Johnson', resource: 'Case #2024-001', timestamp: '2024-01-16T10:30:00Z', ip_address: '192.168.1.10', details: 'Created new theft investigation case' },
    { id: 2, action: 'Evidence Uploaded', user: 'Officer Smith', resource: 'Evidence ID: 234', timestamp: '2024-01-16T09:45:00Z', ip_address: '192.168.1.15', details: 'Uploaded crime scene photos' },
    { id: 3, action: 'User Login', user: 'Det. Brown', resource: 'System Access', timestamp: '2024-01-16T08:15:00Z', ip_address: '192.168.1.20', details: 'Successful login from desktop' },
    { id: 4, action: 'Report Generated', user: 'Supervisor Davis', resource: 'Report #RPT-001', timestamp: '2024-01-16T07:30:00Z', ip_address: '192.168.1.25', details: 'Generated monthly statistics report' },
    { id: 5, action: 'Case Status Updated', user: 'Det. Johnson', resource: 'Case #2024-002', timestamp: '2024-01-15T16:20:00Z', ip_address: '192.168.1.10', details: 'Changed status from Open to In Progress' }
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('Case')) return FileText;
    if (action.includes('User') || action.includes('Login')) return User;
    if (action.includes('Evidence') || action.includes('Report')) return FileText;
    return Shield;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Created') || action.includes('Login')) return 'bg-green-100 text-green-800';
    if (action.includes('Updated') || action.includes('Uploaded')) return 'bg-blue-100 text-blue-800';
    if (action.includes('Deleted') || action.includes('Failed')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
            <p className="text-slate-600">Monitor all system activities and user actions</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Actions Today</p>
                  <p className="text-2xl font-bold text-slate-900">127</p>
                </div>
                <History className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900">23</p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Failed Attempts</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Data Changes</p>
                  <p className="text-2xl font-bold text-slate-900">45</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search audit logs by user, action, or resource..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="login">Login</option>
                </select>
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="">All Users</option>
                  <option value="officer">Officers</option>
                  <option value="investigator">Investigators</option>
                  <option value="supervisor">Supervisors</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAuditLogs.map((log) => {
                const IconComponent = getActionIcon(log.action);
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900">{log.action}</h3>
                            <Badge className={getActionColor(log.action)}>
                              {log.action.split(' ')[0]}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{log.details}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>User: <span className="font-medium">{log.user}</span></span>
                            <span>Resource: <span className="font-medium">{log.resource}</span></span>
                            <span>IP: <span className="font-medium">{log.ip_address}</span></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-slate-900">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Load More Button */}
            <div className="text-center mt-6">
              <Button variant="outline">Load More Entries</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuditTrail;
