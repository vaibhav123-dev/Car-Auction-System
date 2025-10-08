import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';

/**
 * Registers a new user
 * @param {Object} userData - The user details { name, email, password }
 * @returns {Object} Created user
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
