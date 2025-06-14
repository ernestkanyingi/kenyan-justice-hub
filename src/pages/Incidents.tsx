
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Search, MapPin, Clock } from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Detective Sarah Johnson',
  email: 'sarah.johnson@police.gov',
  role: 'investigator' as const,
  badge_number: '4521',
  department: 'Criminal Investigation Division'
};

const Incidents = () => {
  const mockIncidents = [
    { id: 1, title: 'Traffic Accident on Main Street', type: 'Traffic', priority: 'medium', status: 'responding', location: 'Main St & 2nd Ave', reported_at: '2024-01-16T10:30:00Z', officer: 'Officer Davis' },
    { id: 2, title: 'Break-in Report', type: 'Burglary', priority: 'high', status: 'investigating', location: '123 Oak Street', reported_at: '2024-01-16T09:15:00Z', officer: 'Det. Johnson' },
    { id: 3, title: 'Noise Complaint', type: 'Disturbance', priority: 'low', status: 'resolved', location: '456 Pine Ave', reported_at: '2024-01-16T08:45:00Z', officer: 'Officer Smith' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responding': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Incident Management</h1>
            <p className="text-slate-600">Track and respond to incidents</p>
          </div>
          <Button className="bg-gov-primary hover:bg-gov-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Incidents</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Responding</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">High Priority</p>
                  <p className="text-2xl font-bold text-slate-900">2</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search incidents by title, location, or officer..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                      {incident.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-slate-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{incident.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-2 shrink-0">
                    <Badge className={getPriorityColor(incident.priority)}>
                      {incident.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="font-medium ml-1">{incident.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Officer:</span>
                    <span className="font-medium ml-1">{incident.officer}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-slate-400 mr-1" />
                    <span className="text-slate-500">Reported:</span>
                    <span className="font-medium ml-1">
                      {new Date(incident.reported_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button size="sm" className="flex-1">View Details</Button>
                  <Button size="sm" variant="outline" className="flex-1">Update Status</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Incidents;
