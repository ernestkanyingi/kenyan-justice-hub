
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { 
  FileText, 
  Plus, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  User,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'investigator' | 'supervisor' | 'admin';
  badge_number?: string;
  department?: string;
}

interface DashboardProps {
  user: User;
}

// Mock data - replace with real API calls
const recentCases = [
  {
    id: '1',
    case_number: 'CS-2024-001',
    title: 'Downtown Burglary Investigation',
    status: 'in-progress',
    assigned_officer: 'Det. Sarah Johnson',
    created_at: '2024-01-15T10:30:00Z',
    priority: 'high'
  },
  {
    id: '2',
    case_number: 'CS-2024-002',
    title: 'Vehicle Theft Report',
    status: 'open',
    assigned_officer: 'Officer Mike Davis',
    created_at: '2024-01-14T14:20:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    case_number: 'CS-2024-003',
    title: 'Fraud Investigation',
    status: 'closed',
    assigned_officer: 'Det. Alex Chen',
    created_at: '2024-01-12T09:15:00Z',
    priority: 'low'
  }
];

const recentActivity = [
  {
    id: '1',
    action: 'Evidence uploaded',
    case: 'CS-2024-001',
    user: 'Det. Sarah Johnson',
    timestamp: '2024-01-15T16:45:00Z'
  },
  {
    id: '2',
    action: 'Case status updated',
    case: 'CS-2024-002',
    user: 'Officer Mike Davis',
    timestamp: '2024-01-15T15:30:00Z'
  },
  {
    id: '3',
    action: 'Report submitted',
    case: 'CS-2024-003',
    user: 'Det. Alex Chen',
    timestamp: '2024-01-15T14:20:00Z'
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const getStatusBadge = (status: string) => {
    const config = {
      open: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      closed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };
    
    const statusConfig = config[status as keyof typeof config] || config.open;
    const Icon = statusConfig.icon;
    
    return (
      <Badge className={`${statusConfig.color} font-medium`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-l-red-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-blue-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="space-y-8">
      {/* Page Header with Government Styling */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gov-text">Dashboard</h1>
          <p className="text-gov-text-secondary mt-1">
            Welcome back, {user.name}. Here's your law enforcement overview.
          </p>
        </div>
        <div className="flex space-x-3">
          {['investigator', 'supervisor', 'admin'].includes(user.role) && (
            <Button className="gov-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          )}
          <Button className="gov-button-action">
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <DashboardStats userRole={user.role} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <Card className="gov-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gov-text">
              Recent Cases
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-gov-action hover:text-gov-action/80">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map((caseItem) => (
                <div 
                  key={caseItem.id} 
                  className={`p-4 border-l-4 ${getPriorityColor(caseItem.priority)} bg-slate-50 rounded-r-lg hover:bg-slate-100 transition-colors cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gov-text">
                        Case #{caseItem.case_number}
                      </h4>
                      <p className="text-sm text-gov-text-secondary">{caseItem.title}</p>
                    </div>
                    {getStatusBadge(caseItem.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gov-text-secondary">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {caseItem.assigned_officer}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gov-text">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-gov-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gov-text">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gov-text-secondary">
                      Case {activity.case} by {activity.user}
                    </p>
                    <p className="text-xs text-gov-text-secondary mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific sections */}
      {user.role === 'admin' && (
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gov-text">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Database</h4>
                <p className="text-sm text-green-600">Operational</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">File Storage</h4>
                <p className="text-sm text-green-600">Operational</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800">Backup System</h4>
                <p className="text-sm text-yellow-600">Scheduled Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
