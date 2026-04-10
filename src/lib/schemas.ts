import { z } from 'zod';

export const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['Active', 'Inactive']),
});

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  assignedTo: z.string().min(1, 'Please assign to a staff member'),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/i, 'Invalid time format (HH:MM AM/PM)'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Once']),
  acceptanceCriteria: z.array(z.string()).min(1, 'At least one criterion is required'),
});
