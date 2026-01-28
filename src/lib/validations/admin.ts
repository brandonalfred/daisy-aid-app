import { z } from 'zod';
import { capitalizeFirstLetter } from '@/lib/utils';

export const adminSeedSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const createAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .transform(capitalizeFirstLetter),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .transform(capitalizeFirstLetter),
});

export const updateAdminSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .transform(capitalizeFirstLetter)
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .transform(capitalizeFirstLetter)
    .optional(),
});

export type AdminSeedData = z.infer<typeof adminSeedSchema>;
export type CreateAdminData = z.infer<typeof createAdminSchema>;
export type UpdateAdminData = z.infer<typeof updateAdminSchema>;
