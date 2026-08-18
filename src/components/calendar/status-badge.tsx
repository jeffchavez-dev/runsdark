'use client';

import { CheckCircle, Clock, AlertCircle, Repeat2, XCircle, Zap } from 'lucide-react';

interface StatusBadgeProps {
  status: 'confirmed' | 'pending' | 'needs_followup' | 'rescheduled' | 'cancelled' | 'conflict';
  className?: string;
}

const statusConfig = {
  confirmed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    label: 'Confirmed',
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    label: 'Pending',
  },
  needs_followup: {
    icon: AlertCircle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    label: 'Needs Followup',
  },
  rescheduled: {
    icon: Repeat2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    label: 'Rescheduled',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    label: 'Cancelled',
  },
  conflict: {
    icon: Zap,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Conflict',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}
