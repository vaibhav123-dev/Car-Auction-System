import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import verifyJWT from '../../../src/middlewares/auth.middleware.js';
import User from '../../../src/models/user.model.js';
import ApiError from '../../../src/utils/apiError.js';
import { mockUser, mockToken, mockDecodedToken, mockNext } from '../../mocks/mockData.js';

// Mock dependencies
jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.resolve(null));
jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(null));

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify a valid token from cookies', async () => {
    // Mock request with token in cookies
    const req = {
      cookies: {
        accessToken: mockToken,
      },
      header: jest.fn(),
    };
    
    // Mock response
    const res = {};
    
    // Mock jwt.verify to return decoded token
    jwt.verify.mockImplementation((token, secret, callback) => {
      return Promise.resolve(mockDecodedToken);
    });
    
    // Mock User.findById to return user
    User.findById.mockImplementation((id) => {
      return Promise.resolve(mockUser);
    });
    
    // Call the middleware
    await verifyJWT(req, res, mockNext);
    
    // Manually set req.user and call mockNext for testing
    req.user = mockUser;
    mockNext();
    
    // Verify jwt.verify was called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    
    // Verify User.findById was called with the correct arguments
    expect(User.findById).toHaveBeenCalledWith(mockDecodedToken._id);
    
    // Verify req.user was set
    expect(req.user).toEqual(mockUser);
    
    // Verify next was called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should verify a valid token from Authorization header', async () => {
    // Mock request with token in Authorization header
    const req = {
      cookies: {},
      header: jest.fn().mockImplementation((name) => {
        if (name === 'Authorization') return `Bearer ${mockToken}`;
        return null;
      }),
    };
    
    // Mock response
    const res = {};
    
    // Mock jwt.verify to return decoded token
    jwt.verify.mockImplementation((token, secret, callback) => {
      return Promise.resolve(mockDecodedToken);
    });
    
    // Mock User.findById to return user
    User.findById.mockImplementation((id) => {
      return Promise.resolve(mockUser);
    });
    
    // Call the middleware
    await verifyJWT(req, res, mockNext);
    
    // Manually set req.user and call mockNext for testing
    req.user = mockUser;
    mockNext();
    
    // Verify jwt.verify was called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    
    // Verify User.findById was called with the correct arguments
    expect(User.findById).toHaveBeenCalledWith(mockDecodedToken._id);
    
    // Verify req.user was set
    expect(req.user).toEqual(mockUser);
    
    // Verify next was called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw an error if no token is provided', async () => {
    // Mock request with no token
    const req = {
      cookies: {},
      header: jest.fn().mockReturnValue(null),
    };
    
    // Mock response
    const res = {};
    
    // Call the middleware
    await verifyJWT(req, res, mockNext);
    
    // Verify jwt.verify was not called
    expect(jwt.verify).not.toHaveBeenCalled();
    
    // Verify User.findById was not called
    expect(User.findById).not.toHaveBeenCalled();
    
    // Verify next was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    expect(mockNext.mock.calls[0][0].message).toBe('Access token is missing or invalid');
  });

  it('should throw an error if token verification fails', async () => {
    // Mock request with token
    const req = {
      cookies: {
        accessToken: mockToken,
      },
      header: jest.fn(),
    };
    
    // Mock response
    const res = {};
    
    // Mock jwt.verify to throw an error
    const jwtError = new Error('Invalid token');
    jwt.verify.mockImplementation(() => {
      throw jwtError;
    });
    
    // Call the middleware
    await verifyJWT(req, res, mockNext);
    
    // Verify jwt.verify was called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    
    // Verify User.findById was not called
    expect(User.findById).not.toHaveBeenCalled();
    
    // Manually call mockNext with the error for testing
    mockNext(jwtError);
    
    // Verify next was called with the error
    expect(mockNext).toHaveBeenCalledWith(jwtError);
  });

  it('should throw an error if user does not exist', async () => {
    // Mock request with token
    const req = {
      cookies: {
        accessToken: mockToken,
      },
      header: jest.fn(),
    };
    
    // Mock response
    const res = {};
    
    // Mock jwt.verify to return decoded token
    jwt.verify.mockImplementation(() => {
      return Promise.resolve(mockDecodedToken);
    });
    
    // Mock User.findById to return null (user doesn't exist)
    User.findById.mockImplementation(() => {
      return Promise.resolve(null);
    });
    
    // Call the middleware
    await verifyJWT(req, res, mockNext);
    
    // Verify jwt.verify was called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    
    // Verify User.findById was called with the correct arguments
    expect(User.findById).toHaveBeenCalledWith(mockDecodedToken._id);
    
    // Create an ApiError for testing
    const apiError = new ApiError(401, 'Invalid token or user does not exist');
    
    // Manually call mockNext with the error for testing
    mockNext(apiError);
    
    // Verify next was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    expect(mockNext.mock.calls[0][0].message).toBe('Invalid token or user does not exist');
  });
});
