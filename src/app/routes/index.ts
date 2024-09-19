import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routs';
import { UserRoutes } from '../modules/user/user.router';
import { CarsRoutes } from '../modules/car/car.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { PaymentRouter } from '../modules/payment/payment.router';


const router = Router();

const modulesRoutes = [
  {
    path: '/',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/',
    route: CarsRoutes,
  },
  {
    path: '/',
    route: BookingRoutes,
  },
  {
    path: '/api/stripe',
    route: PaymentRouter,
  },
  
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));
export default router;



