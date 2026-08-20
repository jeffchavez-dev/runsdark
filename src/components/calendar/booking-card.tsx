'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface BookingCardProps {
  title: string;
  startTime?: string;
  status: 'confirmed' | 'pending' | 'needs_followup' | 'rescheduled' | 'cancelled' | 'conflict';
  notes?: string;
  onStatusChange: (newStatus: typeof status) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statuses = ['pending', 'confirmed', 'needs_followup', 'rescheduled', 'cancelled', 'conflict'] as const;

export function BookingCard({
  title,
  startTime,
  status,
  notes,
  onStatusChange,
  onEdit,
  onDelete,
}: BookingCardProps) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const getTimeDisplay = () => {
    if (!startTime) return null;
    const start = new Date(startTime);
    const timeStr = format(start, 'MMM d, h:mm a');
    return <span className="text-xs text-text-muted">{timeStr}</span>;
  };

  return (
    <div className="p-3 rounded-lg bg-bg-surface border border-bg-border hover:border-accent-primary/50 transition-colors group">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-white flex-1 line-clamp-2">{title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 hover:bg-bg-border rounded transition-colors text-text-secondary hover:text-white"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 hover:bg-red-500/10 rounded transition-colors text-text-secondary hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Time */}
        {getTimeDisplay()}

        {/* Status with dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity w-full"
          >
            <StatusBadge status={status} className="flex-1" />
            <ChevronDown className="w-3 h-3 text-text-muted flex-shrink-0" />
          </button>

          {isStatusMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-border rounded-lg border border-bg-border shadow-lg z-10">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onStatusChange(s as typeof status);
                    setIsStatusMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-bg-surface transition-colors ${
                    s === status ? 'bg-bg-surface text-accent-primary font-medium' : 'text-text-secondary'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes preview */}
        {notes && <p className="text-xs text-text-muted line-clamp-2">{notes}</p>}
      </div>
    </div>
  );
}
