import { z } from 'zod';

function capitalizeFirstLetter(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const bookingFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .transform(capitalizeFirstLetter),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .transform(capitalizeFirstLetter),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  dropoffAddress: z.string().min(5, 'Dropoff address is required'),
  appointmentStart: z
    .string()
    .datetime({ message: 'Invalid appointment time' }),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const slotsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type SlotsQuery = z.infer<typeof slotsQuerySchema>;
