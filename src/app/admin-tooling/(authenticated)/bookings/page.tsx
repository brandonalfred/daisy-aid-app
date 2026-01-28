import { BookingsList } from '@/components/admin/bookings/bookings-list';
import { prisma } from '@/lib/prisma';

async function getBookings() {
  return prisma.booking.findMany({
    orderBy: { appointmentStart: 'desc' },
  });
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all booking requests.
        </p>
      </div>
      <BookingsList bookings={bookings} />
    </div>
  );
}
