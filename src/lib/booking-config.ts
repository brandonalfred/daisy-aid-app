export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export const CALENDAR_CONFIG = {
  timezone: 'America/Chicago',
  workingHoursStart: 8,
  workingHoursEnd: 16,
  slotDurationHours: 1,
  maxBookingMonths: 3,
} as const;

export function formatSlotTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
