import { Request, Response, NextFunction } from 'express';
import { BookingValidation } from './booking.validation';

const validateCreateBooking = (req: Request, res: Response, next: NextFunction) => {
  const result = BookingValidation.createBookingValidationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.issues.map(issue => issue.message).join(', ') });
  }
  next();
};

const validateUpdateBooking = (req: Request, res: Response, next: NextFunction) => {
  const result = BookingValidation.updateBookingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.issues.map(issue => issue.message).join(', ') });
  }
  next();
};

export { validateCreateBooking, validateUpdateBooking };
