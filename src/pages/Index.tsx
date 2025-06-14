
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';

const Index = () => {
  const { profile } = useAuth();

  // Convert profile to the format expected by Dashboard
  const user = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    badge_number: profile.badge_number || undefined,
    department: profile.department || undefined,
  } : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout user={user}>
      <Dashboard user={user} />
    </MainLayout>
  );
};

export default Index;
