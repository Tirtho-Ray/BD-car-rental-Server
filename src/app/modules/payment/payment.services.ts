// import Stripe from 'stripe';
// ;
// import config from '../../config';
// import mongoose from 'mongoose';
// import { JwtPayload, jwt } from 'jsonwebtoken';
// import { Booking } from '../booking/booking.model';
// import { User } from '../user/user.model';

// const stripe = new Stripe(config.STRIPE_SECRET as string, {
//   apiVersion: '2024-06-20',
// });

// export class PaymentService {
//   static async createPaymentIntent(bookingId: string, token: string): Promise<string> {
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       throw new Error('Invalid booking ID');
//     }

//     // Verify JWT token
//     const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
//     const userId = decoded.id;

//     const booking = await Booking.findById(bookingId).populate('user');
//     if (!booking) {
//       throw new Error('Booking not found');
//     }

//     const user = await User.findById(booking.user);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     if (userId !== user._id.toString()) {
//       throw new Error('Unauthorized access to this booking');
//     }

//     let stripeCustomerId: string | null = user.stripeCustomerId;
//     if (!stripeCustomerId) {
//       const customer = await stripe.customers.create({
//         email: user.email,
//         name: user.name,
//       });
//       stripeCustomerId = customer.id;
//       user.stripeCustomerId = stripeCustomerId;
//       await user.save();
//     }

//     if (!isString(stripeCustomerId)) {
//       throw new Error('Failed to create or retrieve Stripe customer');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(booking.totalCost * 100),
//       currency: 'usd',
//       customer: stripeCustomerId,
//       payment_method_types: ['card'],
//     });

//     return paymentIntent.client_secret;
//   }
// }
