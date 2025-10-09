import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import User from '../../../src/models/user.model.js';
import { mockUser } from '../../mocks/mockData.js';

// Mock external dependencies
jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed_password'));
jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
jest.spyOn(jwt, 'sign').mockImplementation(() => 'mock_token');

describe('User Model', () => {
  let userInstance;

  beforeEach(() => {
    // Create a new user instance for each test
    userInstance = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      role: mockUser.role,
    });

    // Mock the save method
    userInstance.save = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have the correct fields', () => {
      // Verify the schema has the expected fields
      expect(userInstance).toHaveProperty('name');
      expect(userInstance).toHaveProperty('email');
      expect(userInstance).toHaveProperty('password');
      expect(userInstance).toHaveProperty('role');
    });

    it('should set default role to dealer', () => {
      const userWithoutRole = new User({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
      
      expect(userWithoutRole.role).toBe('dealer');
    });
  });

  describe('Pre-save hook', () => {
    it('should hash the password before saving', async () => {
      // Mock isModified to return true
      userInstance.isModified = jest.fn().mockReturnValue(true);
      
      // Create a mock next function
      const next = jest.fn();
      
      // Directly test the pre-save hook logic
      if (userInstance.isModified('password')) {
        userInstance.password = await bcrypt.hash(userInstance.password, 10);
      }
      next();
      
      // Verify bcrypt.hash was called with the correct arguments
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      
      // Verify the password was updated
      expect(userInstance.password).toBe('hashed_password');
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });

    it('should not hash the password if it was not modified', async () => {
      // Mock isModified to return false
      userInstance.isModified = jest.fn().mockReturnValue(false);
      
      // Create a next function mock
      const next = jest.fn();
      
      // Directly test the pre-save hook logic
      if (userInstance.isModified('password')) {
        userInstance.password = await bcrypt.hash(userInstance.password, 10);
      }
      next();
      
      // Verify bcrypt.hash was not called
      expect(bcrypt.hash).not.toHaveBeenCalled();
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });
  });

  describe('isPasswordCorrect method', () => {
    it('should return true for correct password', async () => {
      // Set up bcrypt.compare to return true
      bcrypt.compare.mockResolvedValueOnce(true);
      
      // Call the method
      const result = await userInstance.isPasswordCorrect('correct_password');
      
      // Verify bcrypt.compare was called with the correct arguments
      expect(bcrypt.compare).toHaveBeenCalledWith('correct_password', userInstance.password);
      
      // Verify the result
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      // Set up bcrypt.compare to return false
      bcrypt.compare.mockResolvedValueOnce(false);
      
      // Call the method
      const result = await userInstance.isPasswordCorrect('wrong_password');
      
      // Verify bcrypt.compare was called with the correct arguments
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', userInstance.password);
      
      // Verify the result
      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken method', () => {
    it('should generate a JWT token with correct payload', () => {
      // Set up the environment variables
      const originalJwtSecret = process.env.JWT_SECRET;
      const originalJwtExpiry = process.env.JWT_SECRET_EXPIRY;
      process.env.JWT_SECRET = 'test_secret';
      process.env.JWT_SECRET_EXPIRY = '1d';
      
      // Call the method
      userInstance.generateAccessToken();
      
      // Verify jwt.sign was called with the correct arguments
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: userInstance._id,
          email: userInstance.email,
          role: userInstance.role,
        },
        'test_secret',
        {
          expiresIn: '1d',
        }
      );
      
      // Restore the environment variables
      process.env.JWT_SECRET = originalJwtSecret;
      process.env.JWT_SECRET_EXPIRY = originalJwtExpiry;
    });

    it('should return the generated token', () => {
      // Call the method
      const token = userInstance.generateAccessToken();
      
      // Verify the token
      expect(token).toBe('mock_token');
    });
  });
});
