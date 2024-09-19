import { Router } from 'express';
import { createPaymentIntent, getPaymentInfo } from './payment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/create-payment-intent',auth(USER_ROLE.USER), createPaymentIntent);
router.get('/payment-info/:bookingId', auth(USER_ROLE.USER), getPaymentInfo);

export const PaymentRouter = router;