'use client';

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CALENDAR_CONFIG } from '@/lib/booking-config';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateSelect }: DatePickerProps) {
  const today = startOfDay(new Date());
  const minSelectableDate = addDays(today, 1);
  const maxSelectableDate = addMonths(today, CALENDAR_CONFIG.maxBookingMonths);

  const currentMonth = startOfMonth(today);
  const maxMonth = startOfMonth(maxSelectableDate);

  const [displayedMonth, setDisplayedMonth] = useState<Date>(currentMonth);

  const canGoPrev = isAfter(displayedMonth, currentMonth);
  const canGoNext = isBefore(displayedMonth, maxMonth);

  const handlePrevMonth = () => {
    if (canGoPrev) {
      setDisplayedMonth(addMonths(displayedMonth, -1));
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setDisplayedMonth(addMonths(displayedMonth, 1));
    }
  };

  const monthEnd = endOfMonth(displayedMonth);

  const dates = eachDayOfInterval({
    start: displayedMonth,
    end: monthEnd,
  }).filter((date) => {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const isPast = isBefore(date, minSelectableDate);
    const isBeyondMax = isAfter(date, maxSelectableDate);
    return !isWeekend && !isPast && !isBeyondMax;
  });

  const isCurrentMonthView = isSameMonth(displayedMonth, today);

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-300">Select a date for your ride:</p>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className={cn(
            'h-8 w-8 text-stone-300 hover:text-white hover:bg-stone-700',
            !canGoPrev && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h3 className="text-lg font-semibold text-white">
          {format(displayedMonth, 'MMMM yyyy')}
        </h3>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          disabled={!canGoNext}
          className={cn(
            'h-8 w-8 text-stone-300 hover:text-white hover:bg-stone-700',
            !canGoNext && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {dates.length > 0 ? (
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
                <span className="text-xs font-medium">
                  {format(date, 'EEE')}
                </span>
                <span className="text-lg font-bold">{format(date, 'd')}</span>
                {!isCurrentMonthView && (
                  <span className="text-xs">{format(date, 'MMM')}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-stone-400 py-8">
          No available dates this month
        </p>
      )}
    </div>
  );
}
