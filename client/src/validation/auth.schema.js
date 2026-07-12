import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, { message: 'Username must contain atleast 4 characters' })
    .max(20, { message: 'Username should contain less than 20 characters' }),
  email: z
    .string()
    .min(1, { message: 'Atleast 1 character is required' })
    .email({ message: 'Please enter a valid email address' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password must contain atleast 6 characters' })
    .max(100, { message: 'Password should contain less than 100 characters' }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Atleast 1 character is required' })
    .email({ message: 'Please enter a valid email address' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password must contain atleast 6 characters' })
    .max(100, { message: 'Password should contain less than 100 characters' }),
});
