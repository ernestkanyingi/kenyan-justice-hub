
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Dashboard from './Dashboard';

// Mock user data - replace with real authentication
const mockUser = {
  id: '1',
  name: 'Detective Sarah Johnson',
  email: 'sarah.johnson@police.gov',
  role: 'investigator' as const,
  badge_number: '4521',
  department: 'Criminal Investigation Division'
};

const Index = () => {
  return (
    <MainLayout user={mockUser}>
      <Dashboard user={mockUser} />
    </MainLayout>
  );
};

export default Index;
