
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'investigator' | 'supervisor' | 'admin';
  badge_number?: string;
  department?: string;
}

interface TopNavBarProps {
  user: User;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ user }) => {
  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Sign out clicked');
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      officer: 'Police Officer',
      investigator: 'Detective',
      supervisor: 'Supervisor',
      admin: 'Administrator'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap = {
      officer: 'bg-blue-100 text-blue-800',
      investigator: 'bg-purple-100 text-purple-800',
      supervisor: 'bg-green-100 text-green-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-gov-primary text-white border-b border-slate-700 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - App title and logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-gov-primary font-bold text-sm">LE</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Law Enforcement Portal</h1>
                <p className="text-blue-200 text-xs">Secure Evidence & Case Management</p>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* User info */}
            <div className="flex items-center space-x-3 border-l border-blue-400 pl-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
                <p className="text-xs text-blue-200">
                  {user.badge_number && `Badge #${user.badge_number}`}
                  {user.department && ` • ${user.department}`}
                </p>
              </div>
              
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Sign out */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
