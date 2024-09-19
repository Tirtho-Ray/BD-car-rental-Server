import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import jwt  from 'jsonwebtoken';
import config from "../../config";

const createUserBooking = catchAsync(async (req, res) => {
    // Extract token from request headers
    const token = req.headers.authorization; // Assuming 'Bearer <token>'
    // console.log("token:",token)

    if (!token) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authorization token not provided",
        });
    }
    // console.log("ser:",token);

    const result = await BookingServices.createUserBookingIntoDB(req.body, token);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking is book successfully",
        data: result
    });
});


 
// const getUserBookings = catchAsync(async (req ,res) => {
//     const userId = req.user?._id;
//     // console.log(`User Id: ${userId}`);
  
//     if (!userId) {
//       return sendResponse(res, {
//         statusCode: httpStatus.UNAUTHORIZED,
//         success: false,
//         message: 'User not authenticated',
//       });
//     }
  

//     const userBookings = await BookingServices.getUserBookingsIntoDB(userId);
  
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'My Bookings retrieved successfully',
//       data: userBookings,
//     });
//     // console.log(`user booking:${userBookings}`);
//   });

const getUserBookings = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated',
    });
  }

  const userBookings = await BookingServices.getUserBookingsIntoDB(userId);

  // Calculate grand total
  const grandTotal = userBookings.reduce((accumulator, booking) => accumulator + booking.totalCost, 0);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Bookings retrieved successfully',
    data: {
      bookings: userBookings,
      grandTotal
    },
  });
});

  const getAllBookings = catchAsync(async (req, res) => {
    const result = await BookingServices.getAllBookingsIntoBD(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Bookings retrieved successfully',
      data: result,
    });
  });

  const returnCar = catchAsync(async (req, res) => {
    const { bookingId, returnTime, returnDate } = req.body;
    const token = req.headers.authorization; // Extract token directly
  
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Token is missing or invalid',
      });
    }

  
    try {
      const updatedBooking = await BookingServices.returnCar(bookingId, returnDate, returnTime, token as string);
      
      res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: 'Car returned successfully',
        data: updatedBooking,
      });
    } catch (error) {
      // console.error("Error in returnCar controller:", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error returning car',
        // error: error.message,
      });
    }
  });
  

  const deleteUserBooking = catchAsync(async (req, res) => {
    const token = req.headers.authorization; // Assuming 'Bearer <token>'
    
    if (!token) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Authorization token not provided",
      });
    }
  
    try {
      // Decode token to get user information
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as { id: string; role: string };
      const userId = decoded.id;
  
      const { bookingId } = req.params;
  
      // Fetch booking to verify ownership
      const booking = await BookingServices.deleteBookingByIntoDB(bookingId);
  
      if (!booking) {
        return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "Booking not found",
        });
      }
  
      // Check if the user making the request is the owner of the booking
      if (booking.user.toString() !== userId) {
        return sendResponse(res, {
          statusCode: httpStatus.FORBIDDEN,
          success: false,
          message: "You are not authorized to delete this booking",
        });
      }
  
      // Proceed with deletion
      await BookingServices.deleteBookingByIntoDB(bookingId);
  
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking deleted successfully",
      });
    } catch (error) {
      // Handle errors
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error deleting booking",
      });
    }
  });
  

export const BookingController = {
    createUserBooking,
    getUserBookings,
    getAllBookings,
    returnCar,
    deleteUserBooking


};
