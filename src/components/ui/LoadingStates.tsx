
import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 3, className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-slate-200 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-slate-200 h-4 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}) => {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gov-button-secondary">
          Try Again
        </Button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<any>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action,
  icon: Icon = FileText 
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
};
