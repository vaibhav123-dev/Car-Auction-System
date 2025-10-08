import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import HTTP_STATUS from "../constant.js"
import User from "../models/user.model.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req?.cookies?.accessToken || req?.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access token is missing or invalid');
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select('-password');

    if(!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token or user does not exist');
    }

    req.user = user;
    next();
})

export default verifyJWT;