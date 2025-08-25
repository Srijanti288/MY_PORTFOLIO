import jwt from "jsonwebtoken";
import {User} from "../models/userSchema.js";
import {catchAsyncError} from "./catchAsyncError.js";
import ErrorHandler from "./error.js";


// Middleware: Verify JWT & Authenticate User
export const isAuthenticated = catchAsyncError(async(req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("Authentication required. Please login.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});