import Stripe from 'stripe';
import { Request, Response } from 'express';
import { Booking } from '../booking/booking.model';
import { User } from '../user/user.model';
import config from '../../config';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { Payment } from './payment.model';

const stripe = new Stripe(config.STRIPE_SECRET as string, {
  apiVersion: '2024-06-20',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  try {
    // Extract token from headers without Bearer prefix
    const token = req.headers.authorization as string;
    if (!token) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Decode the token
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as JwtPayload;
    const userId = decoded.id;

    // Find the booking
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Find the user
    const user = await User.findById(booking.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check authorization
    if (userId !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalCost * 100),
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method_types: ['card'],
    });

    // Save the payment information to the database
    const payment = new Payment({
      bookingId,
      userId,
      amount: booking.totalCost,
      currency: 'usd',
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status, // Note: The status might not be 'succeeded' yet
    });

    await payment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

export const getPaymentInfo = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
  
    try {
      const payment = await Payment.findOne({ bookingId }).exec();
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
  
      res.json(payment);
    } catch (error) {
      console.error('Error fetching payment info:', error);
      res.status(500).json({ error: 'Failed to retrieve payment information' });
    }
  };