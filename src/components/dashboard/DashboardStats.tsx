
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon,
  description 
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className="gov-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gov-text">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
                {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
                <span>{change}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
          <div className="p-3 bg-blue-50 rounded-full ml-4">
            <Icon className="w-8 h-8 text-gov-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  userRole: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  // Mock data - replace with real API calls
  const stats = {
    totalCases: 156,
    activeCases: 23,
    closedCases: 133,
    pendingEvidence: 8,
    recentReports: 12,
    criticalAlerts: 3
  };

  const commonStats = [
    {
      title: 'Total Cases',
      value: stats.totalCases,
      change: '+12% from last month',
      trend: 'up' as const,
      icon: FileText,
      description: 'All cases in the system'
    },
    {
      title: 'Active Cases',
      value: stats.activeCases,
      change: '5 assigned to you',
      trend: 'neutral' as const,
      icon: AlertTriangle,
      description: 'Currently being investigated'
    },
    {
      title: 'Cases Closed',
      value: stats.closedCases,
      change: '+8 this month',
      trend: 'up' as const,
      icon: CheckCircle,
      description: 'Successfully resolved'
    }
  ];

  const investigatorStats = [
    ...commonStats,
    {
      title: 'Pending Evidence',
      value: stats.pendingEvidence,
      change: 'Requires review',
      trend: 'neutral' as const,
      icon: Clock,
      description: 'Evidence awaiting processing'
    }
  ];

  const adminStats = [
    ...investigatorStats,
    {
      title: 'System Alerts',
      value: stats.criticalAlerts,
      change: '2 critical',
      trend: 'down' as const,
      icon: AlertTriangle,
      description: 'Requires immediate attention'
    }
  ];

  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
      case 'supervisor':
        return adminStats;
      case 'investigator':
        return investigatorStats;
      default:
        return commonStats;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {getStatsForRole().map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
};
