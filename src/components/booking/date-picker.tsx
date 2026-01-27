'use client';

import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { CALENDAR_CONFIG } from '@/lib/booking-config';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  daysAhead?: number;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  daysAhead = CALENDAR_CONFIG.bookingWindowDays,
}: DatePickerProps) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: daysAhead }, (_, i) =>
    addDays(today, i + 1)
  ).filter((date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-300">Select a date for your ride:</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {dates.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDateSelect(date)}
              className={cn(
                'flex flex-col items-center cursor-pointer rounded-lg border p-2 transition-colors',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-stone-600 bg-stone-700 text-stone-200 hover:border-stone-500 hover:bg-stone-600'
              )}
            >
              <span className="text-xs font-medium">{format(date, 'EEE')}</span>
              <span className="text-lg font-bold">{format(date, 'd')}</span>
              <span className="text-xs">{format(date, 'MMM')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
