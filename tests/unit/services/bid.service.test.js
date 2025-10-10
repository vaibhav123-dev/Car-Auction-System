import { jest } from '@jest/globals';
import Auction from '../../../src/models/auction.model.js';
import User from '../../../src/models/user.model.js';
import Bid from '../../../src/models/bid.model.js';
import { placeBidService, getWinnerBidService } from '../../../src/services/bid.service.js';
import ApiError from '../../../src/utils/apiError.js';
import HTTP_STATUS from '../../../src/constant.js';
import { mockBid, mockUser, mockAuction } from '../../mocks/mockData.js';

describe('Bid Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock mongoose model static methods
    Auction.findById = jest.fn();
    User.findById = jest.fn();
    Bid.findOne = jest.fn();
    Bid.create = jest.fn();
    Bid.findById = jest.fn();
  });

  describe('placeBidService', () => {
    const validInput = {
      auction_id: mockAuction._id,
      amount: 25000,
      dealer_id: mockUser._id,
    };

    it('should place a bid successfully (first bid scenario)', async () => {
      const validInput = {
        auction_id: mockAuction._id,
        amount: 25000,
        dealer_id: mockUser._id,
      };

      // Mock auction found and status active
      Auction.findById.mockResolvedValue({
        ...mockAuction,
        status: 'active',
        save: jest.fn().mockResolvedValue(true),
      });

      // Mock user found and is dealer
      User.findById.mockResolvedValue({ ...mockUser, role: 'dealer' });

      // Mock no previous bid found (first bid)
      Bid.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      // Mock bid creation
      Bid.create.mockResolvedValue({ _id: 'newBidId' });

      // Mock chained populate to return populated bid
      Bid.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockBid),
        }),
      });

      const result = await placeBidService(validInput);

      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(Bid.findOne).toHaveBeenCalledWith({ auction_id: mockAuction._id });
      expect(Bid.create).toHaveBeenCalledWith({
        amount: validInput.amount,
        dealer_id: validInput.dealer_id,
        auction_id: validInput.auction_id
      });
      expect(result).toEqual(mockBid);
    });


    it('should throw if auction not found', async () => {
      Auction.findById.mockResolvedValue(null);
      await expect(placeBidService(validInput)).rejects.toThrow(ApiError);
      await expect(placeBidService(validInput)).rejects.toMatchObject({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Auction not found',
      });
    });

    it('should throw if auction not active', async () => {
      Auction.findById.mockResolvedValue({ status: 'draft' });
      await expect(placeBidService(validInput)).rejects.toThrow(ApiError);
      await expect(placeBidService(validInput)).rejects.toMatchObject({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Auction is not active',
      });
    });

    it('should throw if user not found or role incorrect', async () => {
      Auction.findById.mockResolvedValue({ ...mockAuction, status: 'active', save: jest.fn() });
      User.findById.mockResolvedValue(null);
      await expect(placeBidService(validInput)).rejects.toThrow(ApiError);

      User.findById.mockResolvedValue({ role: 'buyer' });
      await expect(placeBidService(validInput)).rejects.toThrow(ApiError);
    });

    it('should throw if bid amount too low', async () => {
      Auction.findById.mockResolvedValue({ ...mockAuction, status: 'active', startingPrice: 26000, save: jest.fn() });
      User.findById.mockResolvedValue({ role: 'dealer' });
      await expect(placeBidService({ ...validInput, amount: 20000 })).rejects.toThrow(ApiError);

      Auction.findById.mockResolvedValue({ ...mockAuction, status: 'active', startingPrice: 10000, save: jest.fn() });
      Bid.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ amount: 27000 }),
        }),
      });
      await expect(placeBidService({ ...validInput, amount: 26000 })).rejects.toThrow(ApiError);
    });

    it('should throw if auction has ended', async () => {
      Auction.findById.mockResolvedValue({ ...mockAuction, status: 'active', endTime: new Date(Date.now() - 1000), save: jest.fn() });
      User.findById.mockResolvedValue({ role: 'dealer' });
      Bid.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });
      await expect(placeBidService(validInput)).rejects.toThrow(ApiError);
    });
  });

  describe('getWinnerBidService', () => {
    it('should return the highest bid', async () => {
      Auction.findById.mockResolvedValue(mockAuction);

      Bid.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockBid),
        }),
      });

      const result = await getWinnerBidService(mockAuction._id);
      expect(Auction.findById).toHaveBeenCalledWith(mockAuction._id);
      expect(result).toEqual(mockBid);
    });

    it('should throw if auction not found', async () => {
      Auction.findById.mockResolvedValue(null);
      await expect(getWinnerBidService(mockAuction._id)).rejects.toThrow(ApiError);
    });
  });
});
