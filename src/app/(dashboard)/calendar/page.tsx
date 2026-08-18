'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { BookingBoard } from '@/components/calendar/booking-board';
import { BookingForm } from '@/components/calendar/booking-form';

interface Booking {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  status: 'confirmed' | 'pending' | 'needs_followup' | 'rescheduled' | 'cancelled' | 'conflict';
  notes?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Get clients list to show dropdown
  const { data: clients = [] } = trpc.clients.listClients.useQuery();
  const selectedClient = clients.find((c) => c.id === clientId);

  // Fetch bookings for selected client
  const { data: fetchedBookings = [], isLoading: isLoadingBookings } = trpc.calendar.listBookings.useQuery(
    { clientId: clientId || '' },
    { enabled: !!clientId }
  );

  useEffect(() => {
    if (fetchedBookings.length > 0) {
      setBookings(
        fetchedBookings.map((b: any) => ({
          id: b.id,
          title: b.title,
          startTime: b.start_time,
          endTime: b.end_time,
          status: b.status,
          notes: b.notes,
        }))
      );
    }
  }, [fetchedBookings]);

  // Mutations
  const createMutation = trpc.calendar.createBooking.useMutation({
    onSuccess: () => {
      if (clientId) {
        trpc.calendar.listBookings.invalidateQueries({ clientId });
      }
      setIsFormOpen(false);
      setEditingBooking(null);
    },
  });

  const updateMutation = trpc.calendar.updateBooking.useMutation({
    onSuccess: () => {
      if (clientId) {
        trpc.calendar.listBookings.invalidateQueries({ clientId });
      }
      setIsFormOpen(false);
      setEditingBooking(null);
    },
  });

  const statusMutation = trpc.calendar.updateStatus.useMutation({
    onSuccess: () => {
      if (clientId) {
        trpc.calendar.listBookings.invalidateQueries({ clientId });
      }
    },
  });

  const deleteMutation = trpc.calendar.deleteBooking.useMutation({
    onSuccess: () => {
      if (clientId) {
        trpc.calendar.listBookings.invalidateQueries({ clientId });
      }
    },
  });

  const handleCreateBooking = async (data: any) => {
    if (!clientId) return;
    await createMutation.mutateAsync({
      clientId,
      title: data.title,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
      notes: data.notes,
    });
  };

  const handleUpdateBooking = async (data: any) => {
    if (!editingBooking) return;
    await updateMutation.mutateAsync({
      id: editingBooking.id,
      title: data.title,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
      notes: data.notes,
    });
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    statusMutation.mutate({
      id: bookingId,
      newStatus,
    });
  };

  const handleSelectClient = (newClientId: string) => {
    router.push(`/calendar?client=${newClientId}`);
    setBookings([]);
  };

  if (!clientId || !selectedClient) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Availability Tracker</h1>
          <p className="text-text-secondary mt-2">
            Calendar booking status dashboard for multiple clients
          </p>
        </div>

        {/* Client selector */}
        <div className="max-w-md">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select a client to view bookings
          </label>
          <select
            onChange={(e) => handleSelectClient(e.target.value)}
            className="w-full px-4 py-2 bg-bg-surface border border-bg-border rounded-lg text-white focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
          >
            <option value="">Choose a client...</option>
            {clients.map((client: any) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        {clients.length === 0 && (
          <div className="p-6 rounded-lg bg-bg-surface border border-bg-border text-center">
            <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">
              Create a client first to start tracking bookings
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Availability Tracker</h1>
          <p className="text-text-secondary mt-2">
            {selectedClient.name}
            {selectedClient.company && ` • ${selectedClient.company}`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBooking(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      {/* Client selector */}
      <div className="max-w-sm">
        <select
          value={clientId}
          onChange={(e) => handleSelectClient(e.target.value)}
          className="w-full px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-white text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50"
        >
          {clients.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.company ? `(${client.company})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban board */}
      <div className="bg-bg-surface rounded-lg border border-bg-border p-4">
        <BookingBoard
          bookings={bookings}
          onStatusChange={handleStatusChange}
          onEdit={(bookingId) => {
            const booking = bookings.find((b) => b.id === bookingId);
            if (booking) {
              setEditingBooking(booking);
              setIsFormOpen(true);
            }
          }}
          onDelete={(bookingId) => {
            if (confirm('Delete this booking?')) {
              deleteMutation.mutate({ id: bookingId });
            }
          }}
          isLoading={isLoadingBookings}
        />
      </div>

      {/* Booking form modal */}
      <BookingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBooking(null);
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onSubmit={editingBooking ? handleUpdateBooking : handleCreateBooking}
        initialData={editingBooking || undefined}
      />
    </div>
  );
}
