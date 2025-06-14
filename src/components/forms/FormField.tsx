
import React from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  required, 
  children, 
  description 
}) => {
  return (
    <div className="space-y-2">
      <Label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-slate-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="w-4 h-4 mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

interface CaseTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CaseTypeSelect: React.FC<CaseTypeSelectProps> = ({ value, onChange, error }) => {
  const caseTypes = [
    'Theft',
    'Assault', 
    'Traffic Violation',
    'Fraud',
    'Cybercrime',
    'Domestic Dispute',
    'Missing Person',
    'Narcotics',
    'Vandalism',
    'Burglary',
    'Other'
  ];

  return (
    <FormField label="Case Type" error={error} required>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-primary focus:border-gov-primary transition-colors"
      >
        <option value="">Select case type...</option>
        {caseTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </FormField>
  );
};
