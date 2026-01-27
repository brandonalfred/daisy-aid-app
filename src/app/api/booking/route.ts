import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { NextResponse } from 'next/server';
import { CALENDAR_CONFIG } from '@/lib/booking-config';
import {
  generateTimeSlots,
  getCalendarBusyTimes,
  isSlotAvailable,
  parseSlotEndToUTC,
  parseSlotToUTC,
} from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';
import { bookingFormSchema } from '@/lib/validations/booking';

const CALENDAR_ID = (process.env.GOOGLE_CALENDAR_ID || 'primary').trim();
const { timezone: TIMEZONE } = CALENDAR_CONFIG;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      pickupAddress,
      dropoffAddress,
      appointmentStart,
    } = parsed.data;

    const appointmentDate = parseISO(appointmentStart);
    const appointmentDateCST = toZonedTime(appointmentDate, TIMEZONE);
    const slotStart = format(appointmentDateCST, 'HH:mm');
    const dateOnly = new Date(
      appointmentDateCST.getFullYear(),
      appointmentDateCST.getMonth(),
      appointmentDateCST.getDate()
    );

    const baseSlots = generateTimeSlots(dateOnly);
    const isValidSlot = baseSlots.some((slot) => slot.start === slotStart);
    if (!isValidSlot) {
      return NextResponse.json(
        { error: 'Invalid time slot. Please select a valid time.' },
        { status: 400 }
      );
    }

    let busyTimes: { start: Date; end: Date }[] = [];
    try {
      busyTimes = await getCalendarBusyTimes(dateOnly, CALENDAR_ID);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `[Booking API] Failed to fetch calendar busy times: calendar=${CALENDAR_ID}, date=${format(dateOnly, 'yyyy-MM-dd')}, error=${errorMessage}`,
        error
      );
    }

    const slotEnd = baseSlots.find((s) => s.start === slotStart)?.end ?? '';
    const slotStartUTC = parseSlotToUTC(dateOnly, slotStart);
    const slotEndUTC = parseSlotEndToUTC(dateOnly, slotStart);

    const existingBookings = await prisma.booking.findMany({
      where: {
        appointmentStart: slotStartUTC,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { appointmentStart: true, appointmentEnd: true },
    });

    const available = isSlotAvailable(
      slotStart,
      slotEnd,
      dateOnly,
      busyTimes,
      existingBookings
    );
    if (!available) {
      return NextResponse.json(
        {
          error:
            'This time slot is no longer available. Please select another time.',
        },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        pickupAddress,
        dropoffAddress,
        appointmentStart: slotStartUTC,
        appointmentEnd: slotEndUTC,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        appointmentStart: booking.appointmentStart,
        appointmentEnd: booking.appointmentEnd,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
