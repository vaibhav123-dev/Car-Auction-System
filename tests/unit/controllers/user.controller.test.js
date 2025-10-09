import { jest } from '@jest/globals';
import { mockUser, mockToken } from '../../mocks/mockData.js';

// Create mock functions
const mockValidateAsync = jest.fn();
const mockRegisterUserService = jest.fn();
const mockLoginUserService = jest.fn();
const mockLogoutUserService = jest.fn();
const mockCreated = jest.fn();
const mockSuccess = jest.fn();
const mockNext = jest.fn();
const mockRes = {
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
};

// Create mock controller functions
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await mockValidateAsync({ name, email, password });
    const user = await mockRegisterUserService({ name, email, password });
    return mockCreated(res, { user }, 'User registered successfully');
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await mockValidateAsync({ email, password });
    const { user, token } = await mockLoginUserService({ email, password });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return mockSuccess(res, { user, token }, 'User login successfully');
  } catch (error) {
    return next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await mockLogoutUserService(_id);
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return mockSuccess(res, null, 'User logged out successfully');
  } catch (error) {
    return next(error);
  }
};



describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreated.mockReturnValue('created_response');
    mockSuccess.mockReturnValue('success_response');
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      // Setup
      mockValidateAsync.mockResolvedValueOnce({ name: mockUser.name, email: mockUser.email, password: mockUser.password });
      mockRegisterUserService.mockResolvedValueOnce(mockUser);
      
      const req = { body: { name: mockUser.name, email: mockUser.email, password: mockUser.password } };
      
      // Execute
      const result = await registerUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockValidateAsync).toHaveBeenCalledWith({ name: mockUser.name, email: mockUser.email, password: mockUser.password });
      expect(mockRegisterUserService).toHaveBeenCalledWith({ name: mockUser.name, email: mockUser.email, password: mockUser.password });
      expect(mockCreated).toHaveBeenCalledWith(mockRes, { user: mockUser }, 'User registered successfully');
      expect(result).toBe('created_response');
    });

    it('should handle validation errors', async () => {
      // Setup
      const validationError = new Error('Validation error');
      mockValidateAsync.mockRejectedValueOnce(validationError);
      
      const req = { body: { name: mockUser.name, email: 'invalid-email', password: 'short' } };
      
      // Execute
      await registerUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockValidateAsync).toHaveBeenCalledWith({ name: mockUser.name, email: 'invalid-email', password: 'short' });
      expect(mockRegisterUserService).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      // Setup
      mockValidateAsync.mockResolvedValueOnce({ email: mockUser.email, password: mockUser.password });
      mockLoginUserService.mockResolvedValueOnce({ user: mockUser, token: mockToken });
      
      const req = { body: { email: mockUser.email, password: mockUser.password } };
      
      // Execute
      const result = await loginUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockValidateAsync).toHaveBeenCalledWith({ email: mockUser.email, password: mockUser.password });
      expect(mockLoginUserService).toHaveBeenCalledWith({ email: mockUser.email, password: mockUser.password });
      expect(mockRes.cookie).toHaveBeenCalledWith('token', mockToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { user: mockUser, token: mockToken }, 'User login successfully');
      expect(result).toBe('success_response');
    });

    it('should handle validation errors', async () => {
      // Setup
      const validationError = new Error('Validation error');
      mockValidateAsync.mockRejectedValueOnce(validationError);
      
      const req = { body: { email: 'invalid-email', password: 'short' } };
      
      // Execute
      await loginUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockValidateAsync).toHaveBeenCalledWith({ email: 'invalid-email', password: 'short' });
      expect(mockLoginUserService).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });

  describe('logoutUser', () => {
    it('should logout a user successfully', async () => {
      // Setup
      mockLogoutUserService.mockResolvedValueOnce(undefined);
      
      const req = { user: { _id: mockUser._id } };
      
      // Execute
      const result = await logoutUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockLogoutUserService).toHaveBeenCalledWith(mockUser._id);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, null, 'User logged out successfully');
      expect(result).toBe('success_response');
    });

    it('should handle service errors', async () => {
      // Setup
      const serviceError = new Error('Service error');
      mockLogoutUserService.mockRejectedValueOnce(serviceError);
      
      const req = { user: { _id: mockUser._id } };
      
      // Execute
      await logoutUser(req, mockRes, mockNext);
      
      // Assert
      expect(mockLogoutUserService).toHaveBeenCalledWith(mockUser._id);
      expect(mockRes.clearCookie).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });
});
