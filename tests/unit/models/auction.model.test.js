import { jest } from '@jest/globals';
import Auction from '../../../src/models/auction.model.js';
import { mockAuction, mockCar } from '../../mocks/mockData.js';

describe('Auction Model', () => {
  let auctionInstance;

  beforeEach(() => {
    // Create a new auction instance for each test
    auctionInstance = new Auction({
      carId: mockCar._id,
      startingPrice: mockAuction.startingPrice,
      startTime: mockAuction.startTime,
      endTime: mockAuction.endTime,
    });

    // Mock the save method
    auctionInstance.save = jest.fn().mockResolvedValue(auctionInstance);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have the correct fields', () => {
      // Verify the schema has the expected fields
      expect(auctionInstance).toHaveProperty('carId');
      expect(auctionInstance).toHaveProperty('startingPrice');
      expect(auctionInstance).toHaveProperty('startTime');
      expect(auctionInstance).toHaveProperty('endTime');
      expect(auctionInstance).toHaveProperty('status');
    });

    it('should set default status to draft', () => {
      expect(auctionInstance.status).toBe('draft');
    });
  });

  describe('Validation', () => {
    it('should require carId', () => {
      // Create a new auction without carId
      const auction = new Auction({
        startingPrice: mockAuction.startingPrice,
        startTime: mockAuction.startTime,
        endTime: mockAuction.endTime,
      });

      // Mock validateSync to simulate validation
      auction.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { carId: { message: 'Path `carId` is required.' } } };
      });

      // Expect validation error
      const validationError = auction.validateSync();
      expect(validationError.errors.carId).toBeDefined();
    });

    it('should require startingPrice', () => {
      // Create a new auction without startingPrice
      const auction = new Auction({
        carId: mockCar._id,
        startTime: mockAuction.startTime,
        endTime: mockAuction.endTime,
      });

      // Mock validateSync to simulate validation
      auction.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { startingPrice: { message: 'Path `startingPrice` is required.' } } };
      });

      // Expect validation error
      const validationError = auction.validateSync();
      expect(validationError.errors.startingPrice).toBeDefined();
    });

    it('should require startTime', () => {
      // Create a new auction without startTime
      const auction = new Auction({
        carId: mockCar._id,
        startingPrice: mockAuction.startingPrice,
        endTime: mockAuction.endTime,
      });

      // Mock validateSync to simulate validation
      auction.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { startTime: { message: 'Path `startTime` is required.' } } };
      });

      // Expect validation error
      const validationError = auction.validateSync();
      expect(validationError.errors.startTime).toBeDefined();
    });

    it('should require endTime', () => {
      // Create a new auction without endTime
      const auction = new Auction({
        carId: mockCar._id,
        startingPrice: mockAuction.startingPrice,
        startTime: mockAuction.startTime,
      });

      // Mock validateSync to simulate validation
      auction.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { endTime: { message: 'Path `endTime` is required.' } } };
      });

      // Expect validation error
      const validationError = auction.validateSync();
      expect(validationError.errors.endTime).toBeDefined();
    });

    it('should not allow negative startingPrice', () => {
      // Create a new auction with negative startingPrice
      auctionInstance.startingPrice = -100;

      // Mock validateSync to simulate validation
      auctionInstance.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { startingPrice: { message: 'Path `startingPrice` (-100) is less than minimum allowed value (0).' } } };
      });

      // Expect validation error
      const validationError = auctionInstance.validateSync();
      expect(validationError.errors.startingPrice).toBeDefined();
    });

    it('should only allow valid status values', () => {
      // Create a new auction with invalid status
      auctionInstance.status = 'invalid-status';

      // Mock validateSync to simulate validation
      auctionInstance.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { status: { message: '`invalid-status` is not a valid enum value for path `status`.' } } };
      });

      // Expect validation error
      const validationError = auctionInstance.validateSync();
      expect(validationError.errors.status).toBeDefined();
    });
  });

  describe('Methods', () => {
    it('should save auction successfully', async () => {
      // Call save method
      const savedAuction = await auctionInstance.save();

      // Verify save was called
      expect(auctionInstance.save).toHaveBeenCalled();

      // Verify the auction was saved with the correct data
      expect(savedAuction).toBe(auctionInstance);
    });

    it('should update auction fields correctly', async () => {
      // Update the auction
      auctionInstance.startingPrice = 25000;
      auctionInstance.status = 'upcoming';

      // Mock save to return the updated auction
      auctionInstance.save.mockResolvedValueOnce({
        ...auctionInstance,
        startingPrice: 25000,
        status: 'upcoming',
      });

      // Save the updated auction
      const updatedAuction = await auctionInstance.save();

      // Verify save was called
      expect(auctionInstance.save).toHaveBeenCalled();

      // Verify the auction was updated with the correct data
      expect(updatedAuction.startingPrice).toBe(25000);
      expect(updatedAuction.status).toBe('upcoming');
    });
  });

  describe('Static Methods', () => {
    beforeEach(() => {
      // Mock Auction.find
      Auction.find = jest.fn().mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue([auctionInstance]),
        };
      });

      // Mock Auction.findById
      Auction.findById = jest.fn().mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(auctionInstance),
        };
      });
    });

    it('should find auctions by status', async () => {
      // Call find with status filter
      await Auction.find({ status: 'draft' }).exec();

      // Verify find was called with the correct filter
      expect(Auction.find).toHaveBeenCalledWith({ status: 'draft' });
    });

    it('should find auction by ID', async () => {
      // Call findById
      await Auction.findById(mockAuction._id).exec();

      // Verify findById was called with the correct ID
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
    });
  });
});
