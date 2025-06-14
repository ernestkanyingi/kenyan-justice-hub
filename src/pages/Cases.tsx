
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Filter } from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Detective Sarah Johnson',
  email: 'sarah.johnson@police.gov',
  role: 'investigator' as const,
  badge_number: '4521',
  department: 'Criminal Investigation Division'
};

const Cases = () => {
  const mockCases = [
    { id: 1, case_number: '2024-001', title: 'Armed Robbery Investigation', type: 'Theft', status: 'open', assigned_officer: 'Det. Johnson', created_at: '2024-01-15' },
    { id: 2, case_number: '2024-002', title: 'Domestic Violence Report', type: 'Assault', status: 'in-progress', assigned_officer: 'Officer Smith', created_at: '2024-01-16' },
    { id: 3, case_number: '2024-003', title: 'Traffic Accident Investigation', type: 'Traffic Violation', status: 'closed', assigned_officer: 'Officer Brown', created_at: '2024-01-14' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Case Management</h1>
            <p className="text-slate-600">Manage and track all active cases</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search cases by number, title, or officer..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                      Case #{caseItem.case_number}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{caseItem.title}</p>
                  </div>
                  <Badge className={`${getStatusColor(caseItem.status)} ml-2 shrink-0`}>
                    {caseItem.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="font-medium ml-1">{caseItem.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned:</span>
                    <span className="font-medium ml-1">{caseItem.assigned_officer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Created:</span>
                    <span className="font-medium ml-1">{new Date(caseItem.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button size="sm" className="flex-1">View Details</Button>
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cases;
