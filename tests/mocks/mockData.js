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

// Mock car data
export const mockCar = {
  _id: '60d0fe4f5311236168a109cb',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  price: 25000,
  description: 'Well maintained sedan',
  images: ['image1.jpg', 'image2.jpg'],
  owner: '60d0fe4f5311236168a109ca',
  status: 'available',
};

// Mock car with populated owner
export const mockPopulatedCar = {
  ...mockCar,
  owner: {
    _id: '60d0fe4f5311236168a109ca',
    name: 'Test User',
    email: 'test@example.com',
  },
};

// Mock auction data
export const mockAuction = {
  _id: '60d0fe4f5311236168a109cc',
  carId: mockCar._id,
  startingPrice: 20000,
  startTime: new Date('2025-10-10T10:00:00Z'),
  endTime: new Date('2025-10-15T10:00:00Z'),
  status: 'draft',
};

// Mock populated auction data
export const mockPopulatedAuction = {
  ...mockAuction,
  carId: mockCar,
};
