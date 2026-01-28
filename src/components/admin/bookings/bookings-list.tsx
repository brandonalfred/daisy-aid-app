'use client';

import type { BookingStatus } from '@prisma/client';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BookingStatusBadge } from './booking-status-badge';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string;
  appointmentStart: Date;
  appointmentEnd: Date;
  status: BookingStatus;
  createdAt: Date;
}

interface BookingsListProps {
  bookings: Booking[];
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

const DATE_PRESETS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today', daysAgo: 0 },
  { value: '7days', label: 'Last 7 Days', daysAgo: 7 },
  { value: '30days', label: 'Last 30 Days', daysAgo: 30 },
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest)' },
  { value: 'date-asc', label: 'Date (Oldest)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

function truncateAddress(address: string, maxLength = 30): string {
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
}

function getDateCutoff(daysAgo: number): Date {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  cutoff.setDate(cutoff.getDate() - daysAgo);
  return cutoff;
}

export function BookingsList({ bookings }: BookingsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get('status') || 'all';
  const datePreset = searchParams.get('date') || 'all';
  const sort = searchParams.get('sort') || 'date-desc';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = useCallback(
    (key: string, value: string): void => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeoutId = setTimeout(() => {
      updateParams('search', searchInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput, search, updateParams]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (status !== 'all') {
      result = result.filter((b) => b.status === status);
    }

    const preset = DATE_PRESETS.find((p) => p.value === datePreset);
    if (preset && preset.daysAgo !== undefined) {
      const cutoff = getDateCutoff(preset.daysAgo);
      result = result.filter((b) => new Date(b.appointmentStart) >= cutoff);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (b) =>
          `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchLower) ||
          b.email.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return (
            new Date(b.appointmentStart).getTime() -
            new Date(a.appointmentStart).getTime()
          );
        case 'date-asc':
          return (
            new Date(a.appointmentStart).getTime() -
            new Date(b.appointmentStart).getTime()
          );
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, status, datePreset, sort, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 sm:w-64 border-2 border-gray-300 focus-visible:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={status}
            onValueChange={(v) => updateParams('status', v)}
          >
            <SelectTrigger className="w-36 border-2 border-gray-300 focus-visible:border-primary">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={datePreset}
            onValueChange={(v) => updateParams('date', v)}
          >
            <SelectTrigger className="w-36 border-2 border-gray-300 focus-visible:border-primary">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_PRESETS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => updateParams('sort', v)}>
            <SelectTrigger className="w-36 border-2 border-gray-300 focus-visible:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden lg:table-cell">Pickup</TableHead>
              <TableHead className="hidden lg:table-cell">Dropoff</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                >
                  <TableCell className="font-medium">
                    {booking.firstName} {booking.lastName}
                  </TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell
                    className="hidden lg:table-cell"
                    title={booking.pickupAddress}
                  >
                    {truncateAddress(booking.pickupAddress)}
                  </TableCell>
                  <TableCell
                    className="hidden lg:table-cell"
                    title={booking.dropoffAddress}
                  >
                    {truncateAddress(booking.dropoffAddress)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(booking.appointmentStart)}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(booking.appointmentStart)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isPending && (
        <div className="text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}
    </div>
  );
}
