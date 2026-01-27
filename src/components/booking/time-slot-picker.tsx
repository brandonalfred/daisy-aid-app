'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { formatSlotTime, type TimeSlot } from '@/lib/booking-config';
import { cn } from '@/lib/utils';

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedSlot,
  onSlotSelect,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/booking/slots?date=${dateStr}`);
        if (!response.ok) throw new Error('Failed to fetch slots');
        const data = await response.json();
        setSlots(data.slots);
      } catch (err) {
        setError('Unable to load available times. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  if (!selectedDate) {
    return (
      <p className="text-center text-sm text-stone-400">
        Please select a date first
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-2 text-stone-300">Loading available times...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-red-400">{error}</p>;
  }

  const availableSlots = slots.filter((slot) => slot.available);
  if (availableSlots.length === 0) {
    return (
      <p className="text-center text-sm text-stone-400">
        No available times for this date. Please select another date.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-300">Select a time (CST):</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {availableSlots.map((slot) => {
          const isSelected = selectedSlot === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              onClick={() => onSlotSelect(slot.start)}
              className={cn(
                'cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-stone-600 bg-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-600'
              )}
            >
              {formatSlotTime(slot.start)} CST
            </button>
          );
        })}
      </div>
    </div>
  );
}
