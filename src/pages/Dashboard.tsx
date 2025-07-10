
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { useCasesList } from '@/hooks/useCases';
import { useRecentActivity } from '@/hooks/useDashboardStats';
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


const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // Use real data instead of mock data
  const { data: recentCases = [], isLoading: casesLoading } = useCasesList({});
  const { data: recentActivity = [], isLoading: activityLoading } = useRecentActivity();

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

  const handleNewCase = () => {
    navigate('/cases');
  };

  const handleNewReport = () => {
    navigate('/create-report');
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
            <Button onClick={handleNewCase} className="bg-gov-primary hover:bg-gov-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          )}
          <Button onClick={handleNewReport} className="bg-gov-action hover:bg-gov-action/90 text-white">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/cases')}
              className="text-gov-action hover:text-gov-action/80"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {casesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-primary mx-auto"></div>
                <p className="mt-2 text-gov-text-secondary">Loading cases...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCases.slice(0, 3).map((caseItem) => (
                  <div 
                    key={caseItem.id} 
                    className={`p-4 border-l-4 ${getPriorityColor(caseItem.priority || 'medium')} bg-slate-50 rounded-r-lg hover:bg-slate-100 transition-colors cursor-pointer`}
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
                        Created by user
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {recentCases.length === 0 && (
                  <div className="text-center py-8 text-gov-text-secondary">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No cases found</p>
                  </div>
                )}
              </div>
            )}
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
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-primary mx-auto"></div>
                <p className="mt-2 text-gov-text-secondary">Loading activity...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-gov-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gov-text">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gov-text-secondary">
                        {activity.context ? `${JSON.stringify(activity.context)}` : 'System action'}
                      </p>
                      <p className="text-xs text-gov-text-secondary mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center py-8 text-gov-text-secondary">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            )}
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
