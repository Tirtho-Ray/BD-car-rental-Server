


import { Types } from 'mongoose';

export type TBooking = {
  pickUp:string;
  dropOff: string;
  startDate: string;
  startTime: string;
  returnDate: string | null;
  returnTime: string | null;
  fixedTime:number|null;
  user: Types.ObjectId;
  carId: Types.ObjectId;
  zipCode:string;
  insurance:string;
  NIDPassPort:string;
  DrivingLicense:string;
  totalCost: number;
};

export type TBookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';
