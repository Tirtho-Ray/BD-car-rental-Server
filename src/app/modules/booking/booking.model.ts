import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

// Define the booking schema
const BookingSchema = new Schema<TBooking>(
  {
    pickUp: {
      type: String,
      required: true,
    },
    dropOff: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    fixedTime: {
      type: Number,
      default: null,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'cars', // Use the correct model name
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user', // Use the correct model name
      required: true,
    },
    returnDate: {
      type: String,
      default: null,
    },
    returnTime: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      required: true,
    },
    insurance: {
      type: String,
      required: true,
    },
    NIDPassPort: {
      type: String,
      required: true,
    },
    DrivingLicense: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    
  },
  {
    timestamps: true,
  },
);

// Create the booking model
export const Booking = model<TBooking>('Booking', BookingSchema);