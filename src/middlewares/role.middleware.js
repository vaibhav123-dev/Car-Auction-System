import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';

/**
 * Middleware to check if a user has a specific role
 * @param {String} role - The required role
 * @returns {Function} Middleware function
 */
export const requireRole = (role) => (req, res, next) => {
    // verifyJWT middleware should be called before this middleware
    // to ensure req.user is available
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
    }

    if (req.user.role !== role) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, `Access denied. ${role} role required.`);
    }

    next();
  };

/**
 * Middleware to check if a user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied. Admin role required.');
  }

  next();
};
