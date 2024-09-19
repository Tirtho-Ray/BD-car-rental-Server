import { z } from 'zod';

// Reusable validation for time in HH:MM format
const timeStringSchema = z.string().refine(
  (time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time),
  {
    message: 'Invalid time format, expected "HH:MM" in 24-hour format',
  }
);

// Reusable validation for date in YYYY-MM-DD format
const dateStringSchema = z.string().refine(
  (date) => /^\d{4}-\d{2}-\d{2}$/.test(date),
  {
    message: 'Invalid date format, expected "YYYY-MM-DD"',
  }
).refine(
  (date) => {
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate.getFullYear() === year &&
           parsedDate.getMonth() === month - 1 &&
           parsedDate.getDate() === day;
  },
  {
    message: 'Invalid date, please enter a valid date',
  }
);

// Schema for creating a booking
const createBookingValidationSchema = z.object({
  startDate: dateStringSchema,
  startTime: timeStringSchema,
  endTime: timeStringSchema.optional(),
  fixedTime: z.number().optional()
});

// Schema for updating a booking
export const updateBookingSchema = z.object({
  returnTime: timeStringSchema.optional(),
  returnDate: dateStringSchema.optional(),
  startDate: dateStringSchema.optional(),
  startTime: timeStringSchema.optional(),
  endTime: timeStringSchema.optional(),
  fixedTime: z.number().optional()
}).refine(
  (data) => {
    if (data.returnDate && data.startDate) {
      return new Date(data.returnDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'Return date must be after the start date',
  }
).refine(
  (data) => {
    if (data.endTime && data.startTime) {
      return new Date(`1970-01-01T${data.endTime}:00`) > new Date(`1970-01-01T${data.startTime}:00`);
    }
    return true;
  },
  {
    message: 'End time must be after the start time',
  }
);

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingSchema,
};
