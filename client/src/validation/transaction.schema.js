import { z } from 'zod';

export const transactionSchema = z.object({
  
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Select either Income or Expense" })
  }),
  category: z.string().min(1, "Category is required"),
 date: z.coerce.date().refine((val) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999); // Aaj raat ke 11:59:59 tak allow karo
  return val <= endOfToday;
}, { message: "Are you from the future?" }),
  description: z.string().max(100, "Too long!").optional(),
});