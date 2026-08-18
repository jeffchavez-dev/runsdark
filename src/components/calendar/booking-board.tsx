'use client';

import { BookingCard } from './booking-card';

interface Booking {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  status: 'confirmed' | 'pending' | 'needs_followup' | 'rescheduled' | 'cancelled' | 'conflict';
  notes?: string;
}

interface BookingBoardProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: Booking['status']) => void;
  onEdit?: (bookingId: string) => void;
  onDelete?: (bookingId: string) => void;
  isLoading?: boolean;
}

const columns = [
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'needs_followup', label: 'Needs Followup' },
  { id: 'rescheduled', label: 'Rescheduled' },
  { id: 'conflict', label: 'Conflict' },
  { id: 'cancelled', label: 'Cancelled' },
] as const;

export function BookingBoard({
  bookings,
  onStatusChange,
  onEdit,
  onDelete,
  isLoading,
}: BookingBoardProps) {
  const getBookingsByStatus = (status: string) => {
    return bookings.filter((b) => b.status === status);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-text-secondary">Loading bookings...</div>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-full pr-4">
        {columns.map((column) => {
          const columnBookings = getBookingsByStatus(column.id);
          return (
            <div key={column.id} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div className="mb-3 flex items-center justify-between sticky top-0 bg-bg-primary z-10 py-2">
                <h3 className="font-semibold text-sm text-white">{column.label}</h3>
                <span className="px-2 py-1 rounded-full bg-bg-surface text-xs text-text-secondary">
                  {columnBookings.length}
                </span>
              </div>

              {/* Column content */}
              <div className="space-y-2 min-h-96">
                {columnBookings.length === 0 ? (
                  <div className="h-24 rounded-lg border-2 border-dashed border-bg-border flex items-center justify-center">
                    <span className="text-xs text-text-muted">No bookings</span>
                  </div>
                ) : (
                  columnBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      {...booking}
                      onStatusChange={(newStatus) => onStatusChange(booking.id, newStatus)}
                      onEdit={onEdit ? () => onEdit(booking.id) : undefined}
                      onDelete={onDelete ? () => onDelete(booking.id) : undefined}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
