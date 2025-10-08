import ApiResponse from '../utils/apiResponse.js';
import { registerUserService } from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';
import userValidationSchema from '../validations/user.validation.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = userValidationSchema.validate({ name, email, password });
  if (error) throw new ApiError(HTTP_STATUS.BAD_REQUEST, error.details[0].message);

  const user = await registerUserService({ name, email, password });

  // Automatically sends status 201 and standard format
  return ApiResponse.created(res, { user }, 'User registered successfully');
});
