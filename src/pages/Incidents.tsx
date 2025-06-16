
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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

  const handleReportIncident = () => {
    navigate('/create-incident');
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header with Government Styling */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gov-text">Incident Management</h1>
            <p className="text-gov-text-secondary">Track and respond to incidents</p>
          </div>
          <Button 
            onClick={handleReportIncident}
            className="gov-button-primary w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Quick Stats with Government Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gov-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gov-text-secondary">Active Incidents</p>
                  <p className="text-2xl font-bold text-gov-text">12</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gov-danger" />
              </div>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gov-text-secondary">Responding</p>
                  <p className="text-2xl font-bold text-gov-text">3</p>
                </div>
                <Clock className="w-8 h-8 text-gov-action" />
              </div>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gov-text-secondary">High Priority</p>
                  <p className="text-2xl font-bold text-gov-text">2</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gov-danger" />
              </div>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gov-text-secondary">Resolved Today</p>
                  <p className="text-2xl font-bold text-gov-text">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gov-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search with Government Styling */}
        <Card className="gov-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gov-text-secondary w-4 h-4" />
              <Input 
                placeholder="Search incidents by title, location, or officer..." 
                className="pl-10 gov-form-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incidents List with Government Styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockIncidents.map((incident) => (
            <Card key={incident.id} className="gov-card hover:shadow-gov-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-gov-text truncate">
                      {incident.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gov-text-secondary mt-1">
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
                    <span className="text-gov-text-secondary">Type:</span>
                    <span className="font-medium ml-1 text-gov-text">{incident.type}</span>
                  </div>
                  <div>
                    <span className="text-gov-text-secondary">Assigned Officer:</span>
                    <span className="font-medium ml-1 text-gov-text">{incident.officer}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gov-text-secondary mr-1" />
                    <span className="text-gov-text-secondary">Reported:</span>
                    <span className="font-medium ml-1 text-gov-text">
                      {new Date(incident.reported_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button size="sm" className="flex-1 gov-button-primary">View Details</Button>
                  <Button size="sm" className="flex-1 gov-button-secondary">Update Status</Button>
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
