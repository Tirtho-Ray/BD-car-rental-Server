
import jwt from 'jsonwebtoken';
import config from '../../config';
import { TBooking } from './booking.interface';
import { User } from '../user/user.model';
import { Booking } from './booking.model';
import { Cars } from '../car/car.model';

interface IDecodedToken {
  id: string;
  role: string;
}
// const createUserBookingIntoDB = async (payload: TBooking, token: string) => {
//   try {
//     // Verify and decode the token
//     const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as IDecodedToken;

//     // Find the user by ID from the decoded token
//     const user = await User.findById(decoded.id);
//     // console.log("user:" ,user)

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // console.log(user);

//     // Create the booking with user information
//     const bookingData = { ...payload, user: user._id };

//     // If provide fixed hour
//     if (payload.fixedTime) {
//       const car = await Cars.findById(payload.carId);
//       if (!car) {
//         throw new Error('Car not found');
//       }

//       const totalCost = payload.fixedTime * car.pricePerHour;
//       bookingData.totalCost = totalCost;
//     }
//     const booking = await Booking.create(bookingData);

//     // update status
//     await Cars.findByIdAndUpdate(
//       payload.carId,
//       { status: 'unavailable' }, // Set the status to 'booked' or any appropriate status
//       { new: true } // Ensure to get the updated document
//     );


//     // Populate the user and car data in the booking
//     const populatedBooking = await Booking.findById(booking._id)
//       .populate('user', '_id name email role phone ') // Include only the specified user fields
//       .populate('carId','_id name image carType pricePerHour'); // Assuming carId is correctly referenced

//     return populatedBooking;
//   } catch (error) {
//     // console.error(error);
//     throw new Error('Error creating booking');
//   }
// };

const createUserBookingIntoDB = async (payload: TBooking, token: string) => {
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as IDecodedToken;
    
    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Create the booking with user information
    const bookingData = { ...payload, user: user._id };

    const car = await Cars.findById(payload.carId);
    if (!car) {
      throw new Error('Car not found');
    }

    let totalCost = 0;

    // Calculate total cost based on fixedTime or startDate, startTime, returnDate, and returnTime
    if (payload.fixedTime) {
      totalCost = payload.fixedTime * car.pricePerHour;
    } else if (payload.startDate && payload.startTime && payload.returnDate && payload.returnTime) {
      // If both start and return times are provided, calculate duration and cost
      const start = new Date(`${payload.startDate}T${payload.startTime}`);
      const end = new Date(`${payload.returnDate}T${payload.returnTime}`);
      const durationInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Calculate total cost based on duration and price per hour
      totalCost = durationInHours * car.pricePerHour;
    } else {
      // If no fixedTime and no return date/time, allow the booking but set totalCost to 0
      totalCost = 0;
    }

    bookingData.totalCost = totalCost;

    // Log bookingData before creation
    const booking = await Booking.create(bookingData);

    // Update car status to unavailable after booking
    await Cars.findByIdAndUpdate(
      payload.carId,
      { status: 'unavailable' },
      { new: true }
    );

    // Populate booking with user and car details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', '_id name email role phone ')
      .populate('carId', '_id name image carType pricePerHour status');

    return populatedBooking;
  } catch (error) {
    console.error("Error creating booking:", error);

    return {
      succeed: false,
      message: "Error creating booking"
     
    };
  }
};

const getUserBookingsIntoDB = async (userId: string) => {
    const userBookings = await Booking.find({ user: userId })
      .populate('user')
      .populate('carId');
    // console.log(userBookings);
    return userBookings;
  };

  const getAllBookingsIntoBD = async (query:{ carId?: string; date?: string }) => {
    const filter : any = {};
  
    if (query.carId) {
      filter.carId = query.carId;
    }
  
    if (query.date) {
      filter.date = query.date;
    }
  
    const bookings = await Booking.find(filter)
      .populate('user')
      .populate('carId','_id name image carType pricePerHour');
  
    return bookings;
  };


const returnCar = async (bookingId: string, returnDate: string, returnTime: string, token: string): Promise<TBooking | null> => {
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as IDecodedToken;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId)
      .populate('user', '_id name email role phone')
      .populate('carId', '_id name image carType pricePerHour status');

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if the user has the right role to perform this action
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
      throw new Error('Unauthorized access');
    }

    // Update booking with return date and time
    booking.returnDate = returnDate;
    booking.returnTime = returnTime;

    const car = await Cars.findById(booking.carId);
    if (!car) {
      throw new Error('Car not found');
    }

    let totalCost = 0;

    // Calculate total cost based on fixedTime or duration between startTime and returnTime
    if (booking.fixedTime) {
      totalCost = booking.fixedTime * car.pricePerHour;
    } else {
      const startDateTime = new Date(`${booking.startDate}T${booking.startTime}:00`);
      const returnDateTime = new Date(`${returnDate}T${returnTime}:00`);
      
      const durationMs = returnDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60); // Convert milliseconds to hours f***

      totalCost = durationHours * car.pricePerHour;
    }

    booking.totalCost = totalCost;

    // Update the car's status to 'available'
    await Cars.findByIdAndUpdate(
      booking.carId,
      { status: 'available' },
      { new: true }
    );

    // Save the updated booking
    await booking.save();

    return booking;
  } catch (error) {
    // console.error("Error in returnCar function:", error);
    throw new Error('Error returning car');
  }
};



// Delete booking by ID
const deleteBookingByIntoDB = async (bookingId: string) => {
  return Booking.findByIdAndDelete(bookingId);
};



export const BookingServices = {
  createUserBookingIntoDB,
  getUserBookingsIntoDB,
  getAllBookingsIntoBD,
  returnCar,
 deleteBookingByIntoDB


};
