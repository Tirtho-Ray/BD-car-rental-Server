import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services"

const createAdmin = catchAsync(async (req,res)=>{
    const result = await UserServices.createAdminIntoDB(req.body);
    sendResponse(res ,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Admin is created successfully",
        data: result
    })

})

const updateUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await UserServices.updateUserIntoDB(userId, req.body);
  
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  });
export const UserController = {
    createAdmin,
    updateUser
}
