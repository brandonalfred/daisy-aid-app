import { addHours, format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { google } from 'googleapis';
import { CALENDAR_CONFIG, type TimeSlot } from './booking-config';

export interface BusyPeriod {
  start: Date;
  end: Date;
}

function getCalendarClient(): ReturnType<typeof google.calendar> {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set'
    );
  }

  const credentials = JSON.parse(serviceAccountKey);
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  return google.calendar({ version: 'v3', auth });
}

function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Creates a Date representing the given time on the specified date.
 * The returned Date is in local time, intended to be converted to UTC
 * via fromZonedTime() with the business timezone.
 */
function createLocalDateTime(dateString: string, time: string): Date {
  return new Date(`${dateString}T${time}`);
}

/**
 * Converts a date range in the business timezone to UTC timestamps.
 * Used for querying Google Calendar API which expects UTC.
 */
function getDateRangeInUTC(dateString: string): { start: Date; end: Date } {
  const dayStart = createLocalDateTime(dateString, '00:00:00');
  const dayEnd = createLocalDateTime(dateString, '23:59:59.999');

  return {
    start: fromZonedTime(dayStart, CALENDAR_CONFIG.timezone),
    end: fromZonedTime(dayEnd, CALENDAR_CONFIG.timezone),
  };
}

export async function getCalendarBusyTimes(
  date: Date,
  calendarId: string
): Promise<BusyPeriod[]> {
  const calendar = getCalendarClient();
  const dateString = formatDateString(date);
  const { start: dayStartUTC, end: dayEndUTC } = getDateRangeInUTC(dateString);

  console.log(
    `[Calendar] Querying busy times for calendar=${calendarId}, range=${dayStartUTC.toISOString()} to ${dayEndUTC.toISOString()}`
  );

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStartUTC.toISOString(),
      timeMax: dayEndUTC.toISOString(),
      timeZone: CALENDAR_CONFIG.timezone,
      items: [{ id: calendarId }],
    },
  });

  const busyTimes = response.data.calendars?.[calendarId]?.busy || [];

  const result = busyTimes
    .filter(
      (period): period is { start: string; end: string } =>
        Boolean(period.start) && Boolean(period.end)
    )
    .map((period) => ({
      start: new Date(period.start),
      end: new Date(period.end),
    }));

  console.log(
    `[Calendar] Found ${result.length} busy period(s) for calendar=${calendarId}, date=${dateString}`
  );

  return result;
}

export function generateTimeSlots(date: Date): Omit<TimeSlot, 'available'>[] {
  const dateString = formatDateString(date);
  const dayStart = createLocalDateTime(dateString, '00:00:00');
  const { workingHoursStart, workingHoursEnd, slotDurationHours } =
    CALENDAR_CONFIG;

  const slots: Omit<TimeSlot, 'available'>[] = [];
  for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
    const slotStart = addHours(dayStart, hour);
    const slotEnd = addHours(slotStart, slotDurationHours);
    slots.push({
      start: format(slotStart, 'HH:mm'),
      end: format(slotEnd, 'HH:mm'),
    });
  }

  return slots;
}

function periodsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2;
}

export function isSlotAvailable(
  slotStart: string,
  slotEnd: string,
  date: Date,
  busyTimes: BusyPeriod[],
  existingBookings: { appointmentStart: Date; appointmentEnd: Date }[]
): boolean {
  const dateString = formatDateString(date);
  const slotStartLocal = createLocalDateTime(dateString, `${slotStart}:00`);
  const slotEndLocal = createLocalDateTime(dateString, `${slotEnd}:00`);

  const slotStartUTC = fromZonedTime(slotStartLocal, CALENDAR_CONFIG.timezone);
  const slotEndUTC = fromZonedTime(slotEndLocal, CALENDAR_CONFIG.timezone);

  const hasConflict =
    busyTimes.some((busy) =>
      periodsOverlap(slotStartUTC, slotEndUTC, busy.start, busy.end)
    ) ||
    existingBookings.some((booking) =>
      periodsOverlap(
        slotStartUTC,
        slotEndUTC,
        booking.appointmentStart,
        booking.appointmentEnd
      )
    );

  return !hasConflict;
}

export function parseSlotToUTC(date: Date, slotStart: string): Date {
  const dateString = formatDateString(date);
  const slotLocal = createLocalDateTime(dateString, `${slotStart}:00`);
  return fromZonedTime(slotLocal, CALENDAR_CONFIG.timezone);
}

export function parseSlotEndToUTC(date: Date, slotStart: string): Date {
  const startUTC = parseSlotToUTC(date, slotStart);
  return addHours(startUTC, CALENDAR_CONFIG.slotDurationHours);
}
