import { jest } from '@jest/globals';
import Car from '../../../src/models/car.model.js';
import {
  createCarService,
  updateCarService,
  deleteCarService,
  getCarByIdService,
  getCarsService,
  updateCarStatusService,
} from '../../../src/services/car.service.js';
import ApiError from '../../../src/utils/apiError.js';
import HTTP_STATUS from '../../../src/constant.js';
import { mockCar, mockUser, mockPopulatedCar } from '../../mocks/mockData.js';

// Mock the Car model methods
jest.mock('../../../src/models/car.model.js');

// Setup spies for Car model methods before each test
beforeEach(() => {
  jest.spyOn(Car, 'create').mockImplementation(() => Promise.resolve(mockCar));
  jest.spyOn(Car, 'findById').mockImplementation(() => Promise.resolve(mockCar));
  jest.spyOn(Car, 'find').mockImplementation(() => Promise.resolve([mockCar]));
  jest.spyOn(Car, 'deleteOne').mockImplementation(() => Promise.resolve({ deletedCount: 1 }));
});

describe('Car Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCarService', () => {
    it('should create a new car successfully', async () => {
      // Mock Car.create to return the mock car
      Car.create.mockResolvedValueOnce(mockCar);
      
      // Car data without owner
      const carData = {
        make: mockCar.make,
        model: mockCar.model,
        year: mockCar.year,
        price: mockCar.price,
        description: mockCar.description,
        images: mockCar.images,
      };
      
      // Call the service
      const result = await createCarService(carData, mockUser._id);
      
      // Verify Car.create was called with the correct arguments
      expect(Car.create).toHaveBeenCalledWith({
        ...carData,
        owner: mockUser._id,
      });
      
      // Verify the result
      expect(result).toEqual(mockCar);
    });
  });

  describe('updateCarService', () => {
    it('should update a car successfully', async () => {
      // Create a mock car with the save method
      const mockCarWithSave = {
        ...mockCar,
        owner: {
          toString: jest.fn().mockReturnValue(mockUser._id),
        },
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarWithSave);
      
      // Update data
      const updateData = {
        price: 28000,
      };
      
      // Call the service
      const result = await updateCarService(mockCar._id, updateData, mockUser._id);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify the car was updated
      expect(mockCarWithSave.price).toBe(updateData.price);
      
      // Verify save was called
      expect(mockCarWithSave.save).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockCarWithSave);
    });

    it('should throw an error if car does not exist', async () => {
      // Mock Car.findById to return null (car doesn't exist)
      Car.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        updateCarService(mockCar._id, { price: 28000 }, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });

    it('should throw an error if user is not the owner', async () => {
      // Create a mock car with different owner
      const mockCarWithDifferentOwner = {
        ...mockCar,
        owner: {
          toString: jest.fn().mockReturnValue('different-user-id'),
        },
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarWithDifferentOwner);
      
      // Call the service and expect it to throw
      await expect(
        updateCarService(mockCar._id, { price: 28000 }, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });

    it('should throw an error if car is in auction', async () => {
      // Create a mock car in auction
      const mockCarInAuction = {
        ...mockCar,
        status: 'in_auction',
        owner: {
          toString: jest.fn().mockReturnValue(mockUser._id),
        },
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarInAuction);
      
      // Call the service and expect it to throw
      await expect(
        updateCarService(mockCar._id, { price: 28000 }, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });
  });

  describe('deleteCarService', () => {
    it('should delete a car successfully', async () => {
      // Create a mock car with the deleteOne method
      const mockCarWithDelete = {
        ...mockCar,
        owner: {
          toString: jest.fn().mockReturnValue(mockUser._id),
        },
        deleteOne: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarWithDelete);
      
      // Call the service
      const result = await deleteCarService(mockCar._id, mockUser._id);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify deleteOne was called
      expect(mockCarWithDelete.deleteOne).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockCarWithDelete);
    });

    it('should throw an error if car does not exist', async () => {
      // Mock Car.findById to return null (car doesn't exist)
      Car.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        deleteCarService(mockCar._id, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });

    it('should throw an error if user is not the owner', async () => {
      // Create a mock car with different owner
      const mockCarWithDifferentOwner = {
        ...mockCar,
        owner: {
          toString: jest.fn().mockReturnValue('different-user-id'),
        },
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarWithDifferentOwner);
      
      // Call the service and expect it to throw
      await expect(
        deleteCarService(mockCar._id, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });

    it('should throw an error if car is in auction', async () => {
      // Create a mock car in auction
      const mockCarInAuction = {
        ...mockCar,
        status: 'in_auction',
        owner: {
          toString: jest.fn().mockReturnValue(mockUser._id),
        },
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarInAuction);
      
      // Call the service and expect it to throw
      await expect(
        deleteCarService(mockCar._id, mockUser._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });
  });

  describe('getCarByIdService', () => {
    it('should get a car by ID successfully', async () => {
      // Create a mock car with populate method
      const mockCarWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockReturnValueOnce(mockCarWithPopulate);
      
      // Mock the populated result
      mockCarWithPopulate.populate.mockResolvedValueOnce(mockPopulatedCar);
      
      // Call the service
      const result = await getCarByIdService(mockCar._id);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify populate was called with the correct arguments
      expect(mockCarWithPopulate.populate).toHaveBeenCalledWith('owner', 'name email');
      
      // Verify the result
      expect(result).toEqual(mockPopulatedCar);
    });

    it('should throw an error if car does not exist', async () => {
      // Create a mock car with populate method
      const mockCarWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockReturnValueOnce(mockCarWithPopulate);
      
      // Mock the populated result to be null
      mockCarWithPopulate.populate.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        getCarByIdService(mockCar._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify populate was called with the correct arguments
      expect(mockCarWithPopulate.populate).toHaveBeenCalledWith('owner', 'name email');
    });
  });

  describe('getCarsService', () => {
    it('should get all cars successfully', async () => {
      // Create a mock car with populate method
      const mockCarsWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Car.find to return the mock cars
      Car.find.mockReturnValueOnce(mockCarsWithPopulate);
      
      // Mock the populated result
      mockCarsWithPopulate.populate.mockResolvedValueOnce([mockPopulatedCar]);
      
      // Call the service
      const result = await getCarsService();
      
      // Verify Car.find was called with the correct arguments
      expect(Car.find).toHaveBeenCalledWith({});
      
      // Verify populate was called with the correct arguments
      expect(mockCarsWithPopulate.populate).toHaveBeenCalledWith('owner', 'name email');
      
      // Verify the result
      expect(result).toEqual([mockPopulatedCar]);
    });

    it('should get cars with filters successfully', async () => {
      // Create a mock car with populate method
      const mockCarsWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Car.find to return the mock cars
      Car.find.mockReturnValueOnce(mockCarsWithPopulate);
      
      // Mock the populated result
      mockCarsWithPopulate.populate.mockResolvedValueOnce([mockPopulatedCar]);
      
      // Filters
      const filters = {
        make: 'Toyota',
        status: 'available',
      };
      
      // Call the service
      const result = await getCarsService(filters);
      
      // Verify Car.find was called with the correct arguments
      expect(Car.find).toHaveBeenCalledWith(filters);
      
      // Verify populate was called with the correct arguments
      expect(mockCarsWithPopulate.populate).toHaveBeenCalledWith('owner', 'name email');
      
      // Verify the result
      expect(result).toEqual([mockPopulatedCar]);
    });
  });


  describe('updateCarStatusService', () => {
    it('should update car status successfully', async () => {
      // Create a mock car with the save method
      const mockCarWithSave = {
        ...mockCar,
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCarWithSave);
      
      // Call the service
      const result = await updateCarStatusService(mockCar._id, 'in_auction');
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify the status was updated
      expect(mockCarWithSave.status).toBe('in_auction');
      
      // Verify save was called
      expect(mockCarWithSave.save).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockCarWithSave);
    });

    it('should throw an error if car does not exist', async () => {
      // Mock Car.findById to return null (car doesn't exist)
      Car.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        updateCarStatusService(mockCar._id, 'in_auction')
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });
  });
});
