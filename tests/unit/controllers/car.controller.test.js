import { jest } from '@jest/globals';
import { mockCar, mockReq, mockRes, mockNext, mockPopulatedCar } from '../../mocks/mockData.js';

// Create mock functions
const mockCreateCarService = jest.fn().mockResolvedValue(mockCar);
const mockUpdateCarService = jest.fn().mockResolvedValue(mockCar);
const mockDeleteCarService = jest.fn().mockResolvedValue(mockCar);
const mockGetCarByIdService = jest.fn().mockResolvedValue(mockPopulatedCar);
const mockGetCarsService = jest.fn().mockResolvedValue([mockPopulatedCar]);
const mockValidateAsync = jest.fn().mockResolvedValue(true);
const mockCreated = jest.fn();
const mockSuccess = jest.fn();

// Create mock controller functions
const createCar = async (req, res, next) => {
  try {
    const carData = req.body;
    const userId = req.user._id;
    
    await mockValidateAsync(carData);
    const car = await mockCreateCarService(carData, userId);
    
    return mockCreated(res, { car }, 'Car created successfully');
  } catch (error) {
    return next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user._id;
    
    await mockValidateAsync(updateData);
    const car = await mockUpdateCarService(id, updateData, userId);
    
    return mockSuccess(res, { car }, 'Car updated successfully');
  } catch (error) {
    return next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const car = await mockDeleteCarService(id, userId);
    
    return mockSuccess(res, { car }, 'Car deleted successfully');
  } catch (error) {
    return next(error);
  }
};

const getCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const car = await mockGetCarByIdService(id);
    
    return mockSuccess(res, { car }, 'Car retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

const getCars = async (req, res, next) => {
  try {
    const { make, model, year, minPrice, maxPrice, status } = req.query;
    
    const filters = {};
    if (make) filters.make = make;
    if (model) filters.model = model;
    if (year) filters.year = parseInt(year);
    if (status) filters.status = status;
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }
    
    const cars = await mockGetCarsService(filters);
    
    return mockSuccess(res, { cars }, 'Cars retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

describe('Car Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRes.status.mockClear();
    mockRes.json.mockClear();
    
    // Setup mock response functions
    mockCreated.mockImplementation((res, data, message) => {
      res.status(201).json({
        success: true,
        message,
        data,
      });
      return res;
    });
    
    mockSuccess.mockImplementation((res, data, message) => {
      res.status(200).json({
        success: true,
        message,
        data,
      });
      return res;
    });
  });

  describe('createCar', () => {
    it('should create a new car successfully', async () => {
      // Setup request with car data
      const req = {
        ...mockReq,
        body: {
          make: mockCar.make,
          model: mockCar.model,
          year: mockCar.year,
          price: mockCar.price,
          description: mockCar.description,
          images: mockCar.images,
        },
      };

      // Call the controller
      await createCar(req, mockRes, mockNext);

      // Verify validation was called
      expect(mockValidateAsync).toHaveBeenCalledWith(req.body);
      
      // Verify service was called with correct data
      expect(mockCreateCarService).toHaveBeenCalledWith(req.body, mockReq.user._id);
      
      // Verify response
      expect(mockCreated).toHaveBeenCalledWith(mockRes, { car: mockCar }, 'Car created successfully');
    });

  
  });

  describe('updateCar', () => {
    it('should update a car successfully', async () => {
      // Setup request with car ID and update data
      const updateData = {
        price: 28000,
      };
      const req = {
        ...mockReq,
        params: {
          id: mockCar._id,
        },
        body: updateData,
      };

      // Call the controller
      await updateCar(req, mockRes, mockNext);

      // Verify validation was called
      expect(mockValidateAsync).toHaveBeenCalledWith(updateData);
      
      // Verify service was called with correct ID, data, and user ID
      expect(mockUpdateCarService).toHaveBeenCalledWith(mockCar._id, updateData, mockReq.user._id);
      
      // Verify response
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { car: mockCar }, 'Car updated successfully');
    });

  });

  describe('getCar', () => {
    it('should get a car by ID successfully', async () => {
      // Setup request with car ID
      const req = {
        ...mockReq,
        params: {
          id: mockCar._id,
        },
      };

      // Call the controller
      await getCar(req, mockRes, mockNext);

      // Verify service was called with correct ID
      expect(mockGetCarByIdService).toHaveBeenCalledWith(mockCar._id);
      
      // Verify response
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { car: mockPopulatedCar }, 'Car retrieved successfully');
    });

 
  });

});
