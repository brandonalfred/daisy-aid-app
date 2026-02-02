import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { CALENDAR_CONFIG } from './booking-config';

const TEMPLATE_ID = 'd-323583db48fa44ebae38b6554cd48559';
const FROM_EMAIL = 'noreply@daisyaidnemt.com';
const FROM_NAME = 'Daisy Aid';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function formatAppointmentDate(date: Date): string {
  const zonedDate = toZonedTime(date, CALENDAR_CONFIG.timezone);
  const dayOfWeek = format(zonedDate, 'EEEE');
  const month = format(zonedDate, 'MMMM');
  const day = zonedDate.getDate();
  const time = format(zonedDate, 'h:mm a');

  return `${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(day)} at ${time}`;
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  firstName: string;
  bookingId: string;
  appointmentStart: Date;
}): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not configured');
    return false;
  }

  const formattedDate = formatAppointmentDate(params.appointmentStart);
  const currentYear = new Date().getFullYear().toString();

  try {
    await sgMail.send({
      to: params.to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      templateId: TEMPLATE_ID,
      dynamicTemplateData: {
        firstName: params.firstName,
        bookingId: params.bookingId,
        date: formattedDate,
        currentYear,
      },
    });
    console.log(`Booking confirmation email sent to ${params.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}
