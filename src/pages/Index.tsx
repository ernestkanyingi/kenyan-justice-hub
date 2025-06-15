
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';

const Index = () => {
  const { profile, loading, profileLoading } = useAuth();

  // Convert profile to the format expected by Dashboard
  const user = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    badge_number: profile.badge_number || undefined,
    department: profile.department || undefined,
  } : null;

  // Show loading if auth is still initializing OR if we have a user but profile is still loading
  if (loading || (profile === null && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">
            {loading ? 'Initializing...' : 'Loading user data...'}
          </p>
        </div>
      </div>
    );
  }

  // If auth finished loading but no profile exists, show error state
  if (!loading && !profileLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Unable to load user profile</div>
          <p className="text-slate-600 mb-4">Please try refreshing the page or contact support.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gov-primary text-white px-4 py-2 rounded hover:bg-gov-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout user={user!}>
      <Dashboard user={user!} />
    </MainLayout>
  );
};

export default Index;
