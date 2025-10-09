// Jest setup file
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Load environment variables
config({ path: '.env.test' });

// Mock environment variables if not present
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.JWT_SECRET_EXPIRY = process.env.JWT_SECRET_EXPIRY || '1d';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Setup and teardown for mongoose
beforeAll(async () => {
  // Use in-memory MongoDB server for tests or connect to a test database
  if (!process.env.MONGODB_URI_TEST) {
    // If no test URI is provided, use a mock implementation
    jest.mock('mongoose', () => ({
      connect: jest.fn().mockResolvedValue({}),
      connection: {
        on: jest.fn(),
        once: jest.fn(),
      },
      Schema: jest.fn().mockReturnValue({
        pre: jest.fn().mockReturnThis(),
        methods: {},
      }),
      model: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
      }),
    }));
  } else {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  }
});

afterAll(async () => {
  if (process.env.MONGODB_URI_TEST) {
    await mongoose.connection.close();
  }
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
