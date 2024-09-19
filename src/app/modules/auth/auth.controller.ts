import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.services";
import config from "../../config";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
    
  const {accessToken, refreshToken } = await AuthService.login(req.body);
  // const {user,accessToken, refreshToken } = await AuthService.login(req.body);

  // Set refresh token in cookie with secure and HTTP only flags.
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict", // Add this for additional CSRF protection
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully!",
    data: {
      // user: result.user,
      // accessToken: accessToken,
      // refreshToken: refreshToken,
    },
    token: accessToken,
  });
});

export const AuthController = {
  register,
  login,
};
