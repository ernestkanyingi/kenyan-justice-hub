
import React from 'react';
import { TopNavBar } from './TopNavBar';
import { Sidebar } from './Sidebar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'investigator' | 'supervisor' | 'admin';
  badge_number?: string;
  department?: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-gov-background">
      <TopNavBar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6 ml-0 transition-all duration-300">
          <div className="gov-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
