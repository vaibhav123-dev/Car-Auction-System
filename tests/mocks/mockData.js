// Mock data for tests
import { jest } from '@jest/globals';

export const mockUser = {
  _id: '60d0fe4f5311236168a109ca',
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  role: 'dealer',
};

export const mockUserWithHashedPassword = {
  ...mockUser,
  password: '$2a$10$X/4xyVS9KhLVjU.N9xVjkOBw4n6XqDRGFy1CMQZRbqtCdvNrZuZyC', // hashed version of 'Password123!'
};

export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQwZmU0ZjUzMTEyMzYxNjhhMTA5Y2EiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiZGVhbGVyIiwiaWF0IjoxNjI0MjcyNDAwLCJleHAiOjE2MjQzNTg4MDB9.NxW9CJz0NKzdiYRxGFzxZQRGdJV2_7r2j-bKJa9oTiQ';

export const mockDecodedToken = {
  _id: '60d0fe4f5311236168a109ca',
  email: 'test@example.com',
  role: 'dealer',
  iat: 1624272400,
  exp: 1624358800,
};

// Mock request objects
export const mockReq = {
  body: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  },
  cookies: {
    accessToken: mockToken,
  },
  header: (name) => {
    if (name === 'Authorization') return `Bearer ${mockToken}`;
    return null;
  },
  user: mockUser,
};

// Mock response objects
export const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
};

// Mock next function
export const mockNext = jest.fn();

// Mock error
export const mockError = new Error('Test error');
