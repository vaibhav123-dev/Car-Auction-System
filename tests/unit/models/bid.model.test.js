import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import Bid from '../../../src/models/bid.model.js';  // Adjust this path as per your project structure

describe('Bid Model', () => {
  let bidInstance;

  beforeEach(() => {
    // Create a new Bid instance for each test
    bidInstance = new Bid({
      amount: 10000,
      dealer_id: new mongoose.Types.ObjectId(),
      auction_id: new mongoose.Types.ObjectId(),
      previous_bid_id: null,
    });

    // Mock the save method if needed (optional)
    bidInstance.save = jest.fn();

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('Schema validation', () => {
    it('should have required fields', () => {
      expect(bidInstance).toHaveProperty('amount');
      expect(bidInstance).toHaveProperty('dealer_id');
      expect(bidInstance).toHaveProperty('auction_id');
      expect(bidInstance).toHaveProperty('previous_bid_id');
    });

    it('should require amount greater than zero', async () => {
      bidInstance.amount = 0;
      await expect(bidInstance.validate()).rejects.toThrow(/greater than zero/);

      bidInstance.amount = -5;
      await expect(bidInstance.validate()).rejects.toThrow(/greater than zero/);
    });

    it('should require dealer_id', async () => {
      bidInstance.dealer_id = undefined;
      await expect(bidInstance.validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should require auction_id', async () => {
      bidInstance.auction_id = undefined;
      await expect(bidInstance.validate()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should allow previous_bid_id to be null', async () => {
      bidInstance.previous_bid_id = null;
      await expect(bidInstance.validate()).resolves.toBeUndefined();
    });

    it('should accept valid previous_bid_id', async () => {
      bidInstance.previous_bid_id = new mongoose.Types.ObjectId();
      await expect(bidInstance.validate()).resolves.toBeUndefined();
    });
  });
});
