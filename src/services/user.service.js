import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';

/**
 * Registers a new user
 * @param {Object} userData - The user details { name, email, password }
 * @returns {Object} Created user data
 */

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User with this email already exists');
  }

  // Create new user
  const user = await User.create({ name, email, password });

  return user;
};

export const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User with this email does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credientials');
  }

  const token = user.generateAccessToken();

  delete user.password;

  return { user, token };
};

export const logoutUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  await user.save();
};
