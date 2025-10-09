import ApiResponse from '../utils/apiResponse.js';
import {
  loginUserService,
  logoutUserService,
  registerUserService,
} from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import userValidationSchema from '../validations/user.validation.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  await userValidationSchema.validateAsync({ name, email, password });

  const user = await registerUserService({ name, email, password });

  return ApiResponse.created(res, { user }, 'User registered successfully');
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  await userValidationSchema.validateAsync({ email, password });

  const { user, token } = await loginUserService({ email, password });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return ApiResponse.success(res, { user, token }, 'User login successfully');
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { _id } = req.user; // assuming middleware decoded JWT and added `req.user`

  await logoutUserService(_id);

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return ApiResponse.success(res, null, 'User logged out successfully');
});
