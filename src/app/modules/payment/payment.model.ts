// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  status: { type: String, required: true }, // e.g., 'requires_payment_method', 'succeeded', etc.
  paymentReference: { type: String, required: false },
  paymentMethods: [{
    cardId: { type: String, required: true }, // Stripe card ID
    cardBrand: { type: String, required: true }, // e.g., 'Visa', 'MasterCard'
    last4: { type: String, required: true }, // Last 4 digits of the card number
  }]
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
