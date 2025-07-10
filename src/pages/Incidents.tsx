
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Search, MapPin, Clock } from 'lucide-react';
import { useIncidentsList, useIncidentStats } from '@/hooks/useIncidents';

const Incidents = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const user = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    badge_number: profile.badge_number || undefined,
    department: profile.department || undefined,
  } : null;

  const { data: incidents = [], isLoading, error } = useIncidentsList({ q: search });
  const { data: stats } = useIncidentStats();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-gov-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

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
    <MainLayout user={user}>
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
                  <p className="text-2xl font-bold text-gov-text">{stats?.active || 0}</p>
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
                  <p className="text-2xl font-bold text-gov-text">{stats?.responding || 0}</p>
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
                  <p className="text-2xl font-bold text-gov-text">{stats?.highPriority || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gov-danger" />
              </div>
            </CardContent>
          </Card>
          <Card className="gov-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gov-text-secondary">Resolved</p>
                  <p className="text-2xl font-bold text-gov-text">{stats?.resolved || 0}</p>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 gov-form-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incidents List with Government Styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
              <p className="mt-4 text-gov-text-secondary">Loading incidents...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-gov-danger">
              Failed to load incidents
            </div>
          ) : incidents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gov-text-secondary">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No incidents found</p>
            </div>
          ) : (
            incidents.map((incident) => (
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
                      <span className="text-gov-text-secondary">Incident #:</span>
                      <span className="font-medium ml-1 text-gov-text">{incident.incident_number}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gov-text-secondary mr-1" />
                      <span className="text-gov-text-secondary">Reported:</span>
                      <span className="font-medium ml-1 text-gov-text">
                        {new Date(incident.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button size="sm" className="flex-1 gov-button-primary">View Details</Button>
                    <Button size="sm" className="flex-1 gov-button-secondary">Update Status</Button>
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

export default Incidents;
