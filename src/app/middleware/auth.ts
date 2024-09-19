import config from "../config";
import appError from "../error/appError";
import { USER_ROLE, USER_STATUS } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
    return catchAsync(async (req, res, next) => {
        // Ensure the Authorization header exists
        const token = req.headers.authorization;
        if (!token) {
            throw new appError(401, "Authentication token is missing 😢");
        }

        // Verify the JWT token
        let verifiedToken: JwtPayload;
        try {
            verifiedToken = jwt.verify(token, config.JWT_ACCESS_SECRET as string) as JwtPayload;
        } catch (error) {
            throw new appError(401, "Invalid or expired token 😥");
        }

        const { role, email } = verifiedToken;

        // Fetch the user from the database
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new appError(401, "User not found 😢");
        }

        // Check if the user is blocked
        if (user.status === USER_STATUS.BLOCKED) {
            throw new appError(403, "User is blocked 😆");
        }

        // Ensure that the user's role matches the role in the token
        if (user.role !== role) {
            throw new appError(403, "You are not authorized to access this route 🚫");
        }

        // General role-based access control
        if (!requiredRoles.includes(role as keyof typeof USER_ROLE)) {
            throw new appError(403, "You are not authorized to access this route 🚫");
        }

        // Attach user object to the request for downstream usage
        req.user = user;
        next();
    });
}

export default auth;
