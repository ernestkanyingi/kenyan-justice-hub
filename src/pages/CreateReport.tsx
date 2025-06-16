
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportCreate } from '@/hooks/useReports';
import { logAudit } from '@/hooks/useAuditLog';
import { FileText, ArrowLeft } from 'lucide-react';

const CreateReport = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportType = searchParams.get('type') || 'incident';
  
  const [formData, setFormData] = useState({
    title: '',
    type: reportType,
    content: '',
    case_id: searchParams.get('case_id') || '',
  });

  const createReport = useReportCreate();

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
          <p className="mt-4 text-gov-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const reportData = {
        ...formData,
        created_by: profile.id,
        case_id: formData.case_id || null,
      };
      
      await createReport.mutateAsync(reportData);
      await logAudit('Report Created', reportData as any);
      
      navigate('/reports');
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const reportTypeOptions = {
    incident: 'Incident Report',
    investigation: 'Investigation Report',
    statistical: 'Statistical Report',
    custom: 'Custom Report'
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/reports')}
            className="text-gov-text hover:text-gov-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-gov-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gov-text">Create New Report</h1>
            <p className="text-gov-text-secondary">
              Create a {reportTypeOptions[formData.type as keyof typeof reportTypeOptions]}
            </p>
          </div>
        </div>

        <Card className="gov-card max-w-4xl">
          <CardHeader>
            <CardTitle className="text-gov-text">Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gov-text">Report Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="gov-form-input">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident Report</SelectItem>
                      <SelectItem value="investigation">Investigation Report</SelectItem>
                      <SelectItem value="statistical">Statistical Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case_id" className="text-gov-text">Case ID (Optional)</Label>
                  <Input
                    id="case_id"
                    value={formData.case_id}
                    onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                    placeholder="Enter case ID if applicable"
                    className="gov-form-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gov-text">Report Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter report title"
                  required
                  className="gov-form-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-gov-text">Report Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter detailed report content..."
                  rows={12}
                  className="gov-form-input"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/reports')}
                  className="gov-button-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createReport.isPending || !formData.title}
                  className="gov-button-primary"
                >
                  {createReport.isPending ? 'Creating...' : 'Create Report'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateReport;
