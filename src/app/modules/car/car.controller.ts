import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarsServices } from "./car.service";

const createCars = catchAsync(async(req,res)=>{
    const result = await CarsServices.createCarsIntoDB(req.body);
        sendResponse(res ,{
            statusCode: httpStatus.OK,
            success: true,
            message:"Cars is created successfully",
            data: result
        })
})


const getAllCars = catchAsync(async(req,res)=>{
  const query = req.query; // Retrieve search parameters from query string
  const result = await CarsServices.getAllCarsIntoDB(query);
        sendResponse(res ,{
            statusCode: httpStatus.OK,
            success: true,
            message:"Cars retrieved successfully",
            data: result
        })
})


const getSingleCars = catchAsync(async(req,res)=>{
    const {id} = req.params;
    const result = await CarsServices.getSingleCarsIntoDB(id);
        sendResponse(res ,{
            statusCode: httpStatus.OK,
            success: true,
            message:"A Car retrieved successfully",
            data: result
        })
})


const updateCar = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CarsServices.updateCarIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Car updated successfully",
      data: result,
    });
  });


  const deleteCar = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CarsServices.deleteCarIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car deleted successfully',
      data: result,
    });
  });
  

export const CarsController = {
    createCars,
    getAllCars,
    getSingleCars,
    updateCar,
    deleteCar
}