'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface BookingFormProps {
  onSubmit: (data: {
    title: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  initialData?: {
    title: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  };
}

export function BookingForm({
  onSubmit,
  onClose,
  isOpen,
  isLoading,
  initialData,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    notes: initialData?.notes || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface border border-bg-border rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-bg-surface border-b border-bg-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {initialData ? 'Edit Booking' : 'New Booking'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-border rounded transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-secondary">
              Booking Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Client meeting, Follow-up call"
              className="w-full px-3 py-2 bg-bg-border border border-bg-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-secondary">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3 py-2 bg-bg-border border border-bg-border rounded-lg text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-secondary">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3 py-2 bg-bg-border border border-bg-border rounded-lg text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-secondary">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes or details..."
              className="w-full px-3 py-2 bg-bg-border border border-bg-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 resize-none h-20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-text-secondary hover:text-white hover:bg-bg-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Saving...' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
