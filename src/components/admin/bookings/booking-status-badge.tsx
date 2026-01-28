import type { BookingStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
