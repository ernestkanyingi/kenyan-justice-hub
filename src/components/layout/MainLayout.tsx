
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
        <div className="hidden lg:block">
          <Sidebar user={user} />
        </div>
        <main className="flex-1 p-4 sm:p-6 transition-all duration-300">
          <div className="gov-container max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
