import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { NextResponse } from 'next/server';
import { CALENDAR_CONFIG, type TimeSlot } from '@/lib/booking-config';
import {
  generateTimeSlots,
  getCalendarBusyTimes,
  isSlotAvailable,
} from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';
import { slotsQuerySchema } from '@/lib/validations/booking';

const CALENDAR_ID = (process.env.GOOGLE_CALENDAR_ID || 'primary').trim();
const { timezone: TIMEZONE } = CALENDAR_CONFIG;

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const parsed = slotsQuerySchema.safeParse({ date: dateParam });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    const date = parseISO(parsed.data.date);
    const dayStartUTC = fromZonedTime(startOfDay(date), TIMEZONE);
    const dayEndUTC = fromZonedTime(endOfDay(date), TIMEZONE);

    let calendarError: string | null = null;
    let busyTimes: { start: Date; end: Date }[] = [];

    try {
      busyTimes = await getCalendarBusyTimes(date, CALENDAR_ID);
      if (busyTimes.length === 0) {
        console.warn(
          `[Slots API] No busy times returned for calendar=${CALENDAR_ID}, date=${parsed.data.date}. This may indicate a configuration issue.`
        );
      }
    } catch (error) {
      console.error(
        `[Slots API] Failed to fetch calendar busy times: calendar=${CALENDAR_ID}, date=${parsed.data.date}, error=${formatError(error)}`,
        error
      );
      calendarError = 'Unable to verify calendar availability';
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        appointmentStart: {
          gte: dayStartUTC,
          lt: dayEndUTC,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        appointmentStart: true,
        appointmentEnd: true,
      },
    });

    const baseSlots = generateTimeSlots(date);
    const slots: TimeSlot[] = baseSlots.map((slot) => ({
      ...slot,
      available: isSlotAvailable(
        slot.start,
        slot.end,
        date,
        busyTimes,
        existingBookings
      ),
    }));

    return NextResponse.json({
      slots,
      ...(calendarError && { warning: calendarError }),
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
