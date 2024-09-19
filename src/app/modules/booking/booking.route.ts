import express from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateCreateBooking, validateUpdateBooking } from './booking.validation.create';
import { BookingController } from './booking.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post('/bookings',catchAsync(validateCreateBooking),auth(USER_ROLE.USER), BookingController.createUserBooking);
router.get(
    '/my-bookings',
    auth(USER_ROLE.USER), //only access user only his won booking routes
    BookingController.getUserBookings,
  );
  
  router.get(
    '/all-bookings',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    BookingController.getAllBookings,
  );


  router.patch('/cars/return',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateUpdateBooking,
    catchAsync(BookingController.returnCar)
  );
  router.delete('/my-bookings/:bookingId', auth(USER_ROLE.USER),BookingController.deleteUserBooking);



export const BookingRoutes = router;
