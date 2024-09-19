import config from "../../config";
import { USER_ROLE } from "../user/user.constant";

import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { isPasswordMatched } from "./auth.utils";
import jwt from 'jsonwebtoken';  // Corrected import

const register = async (payload: TUser): Promise<any> => {
    const user = await User.findOne({ email: payload.email });
    // check for duplicate email
    if (user) {
        throw new Error('User already exists');
    }
   
    // set user role
    payload.role = USER_ROLE.USER;
    // create new user
    const createNewUser = await User.create(payload);
    return createNewUser;
}

const login = async (payload: TLoginUser) => {
    const user = await User.findOne({ email: payload.email }).select("+password");

    if (!user) {
        throw new Error('User not found');
    }
    if (user.status === "BLOCKED") {
        throw new Error('User is blocked');
    }
    // password match
    const passwordMatch = await isPasswordMatched(payload.password, user.password);
    if (!passwordMatch) {
        throw new Error('Password does not match');
    }

    const JwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id,
    }

    const accessToken = jwt.sign(JwtPayload, 
        config.JWT_ACCESS_SECRET as string, 
        { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(JwtPayload, 
        config.JWT_ACCESS_SECRET as string, 
        { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
    );

    // const userWithoutPassword: TUser & { password?: string } = user.toObject() as TUser & { password?: string };
    // delete userWithoutPassword.password;
    // const { password, ...userWithoutPassword } = user.toObject() as TUser;

return {
    // user:userWithoutPassword,
    accessToken,
    refreshToken
}
}

export const AuthService = {
    register, 
    login 
}
