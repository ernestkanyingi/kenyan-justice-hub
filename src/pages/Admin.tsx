
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, Shield, Database, Activity, AlertTriangle } from 'lucide-react';

const mockUser = {
  id: '1',
  name: 'Administrator',
  email: 'admin@police.gov',
  role: 'admin' as const,
  badge_number: '0001',
  department: 'IT Administration'
};

const Admin = () => {
  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-600">Manage system settings and user access</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">47</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-slate-900">23</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Security Alerts</p>
                  <p className="text-2xl font-bold text-slate-900">2</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">System Health</p>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Manage user accounts, roles, and permissions</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Officers:</span>
                  <Badge variant="secondary">25</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Investigators:</span>
                  <Badge variant="secondary">15</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supervisors:</span>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Admins:</span>
                  <Badge variant="secondary">2</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Manage Users</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2 text-green-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Configure system preferences and security settings</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Backup Status:</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SSL Certificate:</span>
                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span>2 days ago</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">System Config</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="w-5 h-5 mr-2 text-purple-600" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Monitor database performance and manage backups</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Database Size:</span>
                  <span>2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup:</span>
                  <span>1 hour ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Performance:</span>
                  <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Database Tools</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Security Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Monitor security events and manage access controls</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Failed Logins (24h):</span>
                  <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Security Scans:</span>
                  <Badge className="bg-green-100 text-green-800">Passed</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Firewall Status:</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Security Dashboard</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">View system performance and usage statistics</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>CPU Usage:</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span>62%</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span>78% full</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">View Metrics</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Audit & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Review audit logs and compliance reports</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Audit Logs:</span>
                  <span>1,247 entries</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Score:</span>
                  <Badge className="bg-green-100 text-green-800">98%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Review:</span>
                  <span>1 week ago</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">Audit Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
