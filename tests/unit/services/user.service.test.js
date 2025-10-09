import { jest } from '@jest/globals';
import User from '../../../src/models/user.model.js';
import {
  registerUserService,
  loginUserService,
  logoutUserService,
} from '../../../src/services/user.service.js';
import ApiError from '../../../src/utils/apiError.js';
import HTTP_STATUS from '../../../src/constant.js';
import { mockUser, mockToken } from '../../mocks/mockData.js';

// Mock the User model methods
jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(null));
jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(null));
jest.spyOn(User, 'create').mockImplementation(() => Promise.resolve(null));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUserService', () => {
    it('should register a new user successfully', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValueOnce(null);
      
      // Mock User.create to return the mock user
      User.create.mockResolvedValueOnce(mockUser);
      
      // Call the service
      const result = await registerUserService({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
      
      // Verify User.findOne was called with the correct arguments
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      
      // Verify User.create was called with the correct arguments
      expect(User.create).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
      
      // Verify the result
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      // Mock User.findOne to return a user (user exists)
      User.findOne.mockResolvedValueOnce(mockUser);
      
      // Call the service and expect it to throw
      await expect(
        registerUserService({
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
        })
      ).rejects.toThrow(ApiError);
      
      // Verify User.findOne was called with the correct arguments
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      
      // Verify User.create was not called
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUserService', () => {
    it('should login a user successfully', async () => {
      // Create a mock user with the isPasswordCorrect method
      const mockUserWithMethods = {
        ...mockUser,
        isPasswordCorrect: jest.fn().mockResolvedValueOnce(true),
        generateAccessToken: jest.fn().mockReturnValueOnce(mockToken),
      };
      
      // Mock User.findOne to return the mock user
      User.findOne.mockResolvedValueOnce(mockUserWithMethods);
      
      // Call the service
      const result = await loginUserService({
        email: mockUser.email,
        password: mockUser.password,
      });
      
      // Verify User.findOne was called with the correct arguments
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      
      // Verify isPasswordCorrect was called with the correct arguments
      expect(mockUserWithMethods.isPasswordCorrect).toHaveBeenCalledWith(mockUser.password);
      
      // Verify generateAccessToken was called
      expect(mockUserWithMethods.generateAccessToken).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual({
        user: mockUserWithMethods,
        token: mockToken,
      });
    });

    it('should throw an error if user does not exist', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        loginUserService({
          email: mockUser.email,
          password: mockUser.password,
        })
      ).rejects.toThrow(ApiError);
      
      // Verify User.findOne was called with the correct arguments
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });

    it('should throw an error if password is incorrect', async () => {
      // Create a mock user with the isPasswordCorrect method
      const mockUserWithMethods = {
        ...mockUser,
        isPasswordCorrect: jest.fn().mockResolvedValueOnce(false),
      };
      
      // Mock User.findOne to return the mock user
      User.findOne.mockResolvedValueOnce(mockUserWithMethods);
      
      // Call the service and expect it to throw
      await expect(
        loginUserService({
          email: mockUser.email,
          password: 'wrong_password',
        })
      ).rejects.toThrow(ApiError);
      
      // Verify User.findOne was called with the correct arguments
      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      
      // Verify isPasswordCorrect was called with the correct arguments
      expect(mockUserWithMethods.isPasswordCorrect).toHaveBeenCalledWith('wrong_password');
    });
  });

  describe('logoutUserService', () => {
    it('should logout a user successfully', async () => {
      // Create a mock user with the save method
      const mockUserWithSave = {
        ...mockUser,
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock User.findById to return the mock user
      User.findById.mockResolvedValueOnce(mockUserWithSave);
      
      // Call the service
      await logoutUserService(mockUser._id);
      
      // Verify User.findById was called with the correct arguments
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      
      // Verify save was called
      expect(mockUserWithSave.save).toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
      // Mock User.findById to return null (user doesn't exist)
      User.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        logoutUserService(mockUser._id)
      ).rejects.toThrow('User not found');
      
      // Verify User.findById was called with the correct arguments
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    });
  });
});
