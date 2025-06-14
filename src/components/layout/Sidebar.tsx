
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Users, 
  Settings, 
  History,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'investigator' | 'supervisor' | 'admin';
  badge_number?: string;
  department?: string;
}

interface SidebarProps {
  user: User;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const navigation: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: BarChart3, 
      roles: ['officer', 'investigator', 'admin', 'supervisor'] 
    },
    { 
      name: 'Cases', 
      href: '/cases', 
      icon: FileText, 
      roles: ['officer', 'investigator', 'admin', 'supervisor'],
      badge: 5
    },
    { 
      name: 'Evidence', 
      href: '/evidence', 
      icon: Upload, 
      roles: ['investigator', 'admin', 'supervisor'] 
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: Users, 
      roles: ['officer', 'investigator', 'admin', 'supervisor'] 
    },
    { 
      name: 'Incidents', 
      href: '/incidents', 
      icon: AlertTriangle, 
      roles: ['officer', 'investigator', 'admin', 'supervisor'],
      badge: 2
    },
    { 
      name: 'Admin Panel', 
      href: '/admin', 
      icon: Settings, 
      roles: ['admin'] 
    },
    { 
      name: 'Audit Trail', 
      href: '/audit', 
      icon: History, 
      roles: ['admin', 'supervisor'] 
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-4">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Secure Access</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            All actions are logged and monitored
          </p>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navigation
            .filter(item => item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-gov-primary text-white shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-gov-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  
                  {item.badge && item.badge > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium shrink-0 ${
                      active 
                        ? 'bg-white text-gov-primary' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
        </div>

        {/* Role-specific quick actions */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Quick Actions
          </p>
          
          {user.role === 'officer' && (
            <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors truncate">
              New Incident Report
            </button>
          )}
          
          {['investigator', 'supervisor', 'admin'].includes(user.role) && (
            <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors truncate">
              Create New Case
            </button>
          )}
          
          {user.role === 'admin' && (
            <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors truncate">
              System Settings
            </button>
          )}
        </div>

        {/* User session info */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            <p>Session: Active</p>
            <p>Last login: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
