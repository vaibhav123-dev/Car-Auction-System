import { jest } from '@jest/globals';
import Auction from '../../../src/models/auction.model.js';
import Car from '../../../src/models/car.model.js';
import {
  createAuctionService,
  startAuctionService,
  updateAuctionService,
  getAuctionByIdService,
  getAuctionsService,
} from '../../../src/services/auction.service.js';
import ApiError from '../../../src/utils/apiError.js';
import HTTP_STATUS from '../../../src/constant.js';
import { mockAuction, mockCar, mockPopulatedAuction } from '../../mocks/mockData.js';

// Mock the Auction and Car model methods
jest.mock('../../../src/models/auction.model.js');
jest.mock('../../../src/models/car.model.js');

// Setup spies for Auction and Car model methods before each test
beforeEach(() => {
  // Auction model mocks
  jest.spyOn(Auction, 'findOne').mockImplementation(() => Promise.resolve(null));
  jest.spyOn(Auction, 'findById').mockImplementation(() => Promise.resolve(mockAuction));
  jest.spyOn(Auction, 'create').mockImplementation(() => Promise.resolve(mockAuction));
  jest.spyOn(Auction, 'find').mockImplementation(() => Promise.resolve([mockAuction]));
  
  // Car model mocks
  jest.spyOn(Car, 'findById').mockImplementation(() => Promise.resolve(mockCar));
});

describe('Auction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAuctionService', () => {
    it('should create a new auction successfully', async () => {
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCar);
      
      // Mock Auction.findOne to return null (no existing auction)
      Auction.findOne.mockResolvedValueOnce(null);
      
      // Mock Auction.create to return the mock auction
      Auction.create.mockResolvedValueOnce(mockAuction);
      
      // Call the service
      const result = await createAuctionService({
        carId: mockCar._id,
        startingPrice: mockAuction.startingPrice,
        startTime: mockAuction.startTime,
        endTime: mockAuction.endTime,
      });
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify Auction.findOne was called with the correct arguments
      expect(Auction.findOne).toHaveBeenCalledWith({
        carId: mockCar._id,
        status: { $in: ['draft', 'upcoming', 'active'] },
      });
      
      // Verify Auction.create was called with the correct arguments
      expect(Auction.create).toHaveBeenCalledWith({
        carId: mockCar._id,
        startingPrice: mockAuction.startingPrice,
        startTime: mockAuction.startTime,
        endTime: mockAuction.endTime,
        status: 'draft',
      });
      
      // Verify the result
      expect(result).toEqual(mockAuction);
    });

    it('should throw an error if car does not exist', async () => {
      // Mock Car.findById to return null (car doesn't exist)
      Car.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        createAuctionService({
          carId: mockCar._id,
          startingPrice: mockAuction.startingPrice,
          startTime: mockAuction.startTime,
          endTime: mockAuction.endTime,
        })
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify Auction.findOne was not called
      expect(Auction.findOne).not.toHaveBeenCalled();
      
      // Verify Auction.create was not called
      expect(Auction.create).not.toHaveBeenCalled();
    });

    it('should throw an error if car is already in an active auction', async () => {
      // Mock Car.findById to return the mock car
      Car.findById.mockResolvedValueOnce(mockCar);
      
      // Mock Auction.findOne to return an existing auction
      Auction.findOne.mockResolvedValueOnce(mockAuction);
      
      // Call the service and expect it to throw
      await expect(
        createAuctionService({
          carId: mockCar._id,
          startingPrice: mockAuction.startingPrice,
          startTime: mockAuction.startTime,
          endTime: mockAuction.endTime,
        })
      ).rejects.toThrow(ApiError);
      
      // Verify Car.findById was called with the correct arguments
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
      
      // Verify Auction.findOne was called with the correct arguments
      expect(Auction.findOne).toHaveBeenCalledWith({
        carId: mockCar._id,
        status: { $in: ['draft', 'upcoming', 'active'] },
      });
      
      // Verify Auction.create was not called
      expect(Auction.create).not.toHaveBeenCalled();
    });
  });

  describe('startAuctionService', () => {
    it('should start an auction and set status to active if current time is within auction period', async () => {
      // Create a mock auction with the save method
      const mockAuctionWithSave = {
        ...mockAuction,
        status: 'draft',
        startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        endTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithSave);
      
      // Call the service
      const result = await startAuctionService(mockAuction._id);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify the status was set to active
      expect(mockAuctionWithSave.status).toBe('active');
      
      // Verify save was called
      expect(mockAuctionWithSave.save).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockAuctionWithSave);
    });

    it('should start an auction and set status to upcoming if current time is before auction start time', async () => {
      // Create a mock auction with the save method
      const mockAuctionWithSave = {
        ...mockAuction,
        status: 'draft',
        startTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithSave);
      
      // Call the service
      const result = await startAuctionService(mockAuction._id);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify the status was set to upcoming
      expect(mockAuctionWithSave.status).toBe('upcoming');
      
      // Verify save was called
      expect(mockAuctionWithSave.save).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockAuctionWithSave);
    });

    it('should throw an error if auction does not exist', async () => {
      // Mock Auction.findById to return null (auction doesn't exist)
      Auction.findById.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        startAuctionService(mockAuction._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });

    it('should throw an error if auction is not in draft status', async () => {
      // Create a mock auction with non-draft status
      const mockAuctionWithNonDraftStatus = {
        ...mockAuction,
        status: 'active',
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithNonDraftStatus);
      
      // Call the service and expect it to throw
      await expect(
        startAuctionService(mockAuction._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });

    it('should throw an error if auction end time is in the past', async () => {
      // Create a mock auction with end time in the past
      const mockAuctionWithPastEndTime = {
        ...mockAuction,
        status: 'draft',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        endTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithPastEndTime);
      
      // Call the service and expect it to throw
      await expect(
        startAuctionService(mockAuction._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });
  });

  describe('updateAuctionService', () => {
    it('should update an auction successfully', async () => {
      // Create a mock auction with the save method
      const mockAuctionWithSave = {
        ...mockAuction,
        status: 'draft',
        save: jest.fn().mockResolvedValueOnce(undefined),
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithSave);
      
      // Update data
      const updateData = {
        startingPrice: 22000,
        startTime: new Date('2025-10-11T10:00:00Z'),
      };
      
      // Call the service
      const result = await updateAuctionService(mockAuction._id, updateData);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify the auction was updated
      expect(mockAuctionWithSave.startingPrice).toBe(updateData.startingPrice);
      expect(mockAuctionWithSave.startTime).toBe(updateData.startTime);
      
      // Verify save was called
      expect(mockAuctionWithSave.save).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toEqual(mockAuctionWithSave);
    });

    it('should throw an error if auction does not exist', async () => {
      // Mock Auction.findById to return null (auction doesn't exist)
      Auction.findById.mockResolvedValueOnce(null);
      
      // Update data
      const updateData = {
        startingPrice: 22000,
      };
      
      // Call the service and expect it to throw
      await expect(
        updateAuctionService(mockAuction._id, updateData)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });

    it('should throw an error if auction is not in draft status', async () => {
      // Create a mock auction with non-draft status
      const mockAuctionWithNonDraftStatus = {
        ...mockAuction,
        status: 'active',
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockResolvedValueOnce(mockAuctionWithNonDraftStatus);
      
      // Update data
      const updateData = {
        startingPrice: 22000,
      };
      
      // Call the service and expect it to throw
      await expect(
        updateAuctionService(mockAuction._id, updateData)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });
  });

  describe('getAuctionByIdService', () => {
    it('should get an auction by ID successfully', async () => {
      // Create a mock auction with populate method
      const mockAuctionWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockReturnValueOnce(mockAuctionWithPopulate);
      
      // Mock the populated result
      mockAuctionWithPopulate.populate.mockResolvedValueOnce(mockPopulatedAuction);
      
      // Call the service
      const result = await getAuctionByIdService(mockAuction._id);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify populate was called with the correct arguments
      expect(mockAuctionWithPopulate.populate).toHaveBeenCalledWith('carId');
      
      // Verify the result
      expect(result).toEqual(mockPopulatedAuction);
    });

    it('should throw an error if auction does not exist', async () => {
      // Create a mock auction with populate method
      const mockAuctionWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Auction.findById to return the mock auction
      Auction.findById.mockReturnValueOnce(mockAuctionWithPopulate);
      
      // Mock the populated result to be null
      mockAuctionWithPopulate.populate.mockResolvedValueOnce(null);
      
      // Call the service and expect it to throw
      await expect(
        getAuctionByIdService(mockAuction._id)
      ).rejects.toThrow(ApiError);
      
      // Verify Auction.findById was called with the correct arguments
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify populate was called with the correct arguments
      expect(mockAuctionWithPopulate.populate).toHaveBeenCalledWith('carId');
    });
  });

  describe('getAuctionsService', () => {
    it('should get all auctions successfully', async () => {
      // Create a mock auction with populate method
      const mockAuctionsWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Auction.find to return the mock auctions
      Auction.find.mockReturnValueOnce(mockAuctionsWithPopulate);
      
      // Mock the populated result
      mockAuctionsWithPopulate.populate.mockResolvedValueOnce([mockPopulatedAuction]);
      
      // Call the service
      const result = await getAuctionsService();
      
      // Verify Auction.find was called with the correct arguments
      expect(Auction.find).toHaveBeenCalledWith({});
      
      // Verify populate was called with the correct arguments
      expect(mockAuctionsWithPopulate.populate).toHaveBeenCalledWith('carId');
      
      // Verify the result
      expect(result).toEqual([mockPopulatedAuction]);
    });

    it('should get auctions with filters successfully', async () => {
      // Create a mock auction with populate method
      const mockAuctionsWithPopulate = {
        populate: jest.fn().mockReturnThis(),
      };
      
      // Mock Auction.find to return the mock auctions
      Auction.find.mockReturnValueOnce(mockAuctionsWithPopulate);
      
      // Mock the populated result
      mockAuctionsWithPopulate.populate.mockResolvedValueOnce([mockPopulatedAuction]);
      
      // Filters
      const filters = {
        status: 'active',
        carId: mockCar._id,
      };
      
      // Call the service
      const result = await getAuctionsService(filters);
      
      // Verify Auction.find was called with the correct arguments
      expect(Auction.find).toHaveBeenCalledWith(filters);
      
      // Verify populate was called with the correct arguments
      expect(mockAuctionsWithPopulate.populate).toHaveBeenCalledWith('carId');
      
      // Verify the result
      expect(result).toEqual([mockPopulatedAuction]);
    });
  });
});
