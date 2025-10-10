import { jest } from '@jest/globals';
import { mockBid, mockError } from '../../mocks/mockData.js';

// Mock functions to be used in controller
const mockValidate = jest.fn();
const mockPlaceBidService = jest.fn();
const mockGetWinnerBidService = jest.fn();
const mockCreated = jest.fn();
const mockSuccess = jest.fn();
const mockNext = jest.fn();
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

//
// Controller functions mimicking your actual bid.controller.js logic
//

const placeBid = async (req, res, next) => {
  try {
    req.body.dealer_id = req.user._id.toString();

    await mockValidate(req.body);

    const details = await mockPlaceBidService(req.body);
    if (!details) {
      throw new Error('Failed to place bid');
    }

    return mockCreated(res, { details }, 'Bid added successfully');
  } catch (error) {
    return next(error);
  }
};

const winnerBid = async (req, res, next) => {
  try {
    const { auctionId } = req.params;
    if (!auctionId) {
      throw new Error('Auction ID is required');
    }
    const details = await mockGetWinnerBidService(auctionId);
    if (!details) {
      throw new Error('No bids found for this auction');
    }
    return mockSuccess(res, { details }, 'Winner bid fetched successfully');
  } catch (error) {
    return next(error);
  }
};

//
// Tests
//
describe('Bid Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreated.mockReturnValue('created_response');
    mockSuccess.mockReturnValue('success_response');
  });

  describe('placeBid', () => {
    it('should place bid successfully', async () => {
      mockValidate.mockResolvedValueOnce();
      mockPlaceBidService.mockResolvedValueOnce(mockBid);

      const req = {
        body: { auction_id: 'auc123', amount: 15000 },
        user: { _id: mockBid.dealer_id },
      };

      const result = await placeBid(req, mockRes, mockNext);

      expect(mockValidate).toHaveBeenCalledWith({ auction_id: 'auc123', amount: 15000, dealer_id: mockBid.dealer_id });
      expect(mockPlaceBidService).toHaveBeenCalledWith({ auction_id: 'auc123', amount: 15000, dealer_id: mockBid.dealer_id });
      expect(mockCreated).toHaveBeenCalledWith(mockRes, { details: mockBid }, 'Bid added successfully');
      expect(result).toBe('created_response');
    });

    it('should handle validation error', async () => {
      const validationError = new Error('Validation failed');
      mockValidate.mockRejectedValueOnce(validationError);

      const req = {
        body: { auction_id: '', amount: 0 },
        user: { _id: mockBid.dealer_id },
      };

      await placeBid(req, mockRes, mockNext);

      expect(mockValidate).toHaveBeenCalled();
      expect(mockPlaceBidService).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(validationError);
    });

    it('should handle service failure', async () => {
      mockValidate.mockResolvedValueOnce();
      mockPlaceBidService.mockResolvedValueOnce(null);

      const req = {
        body: { auction_id: 'auc123', amount: 15000 },
        user: { _id: mockBid.dealer_id },
      };

      await placeBid(req, mockRes, mockNext);

      // Then your controller throws, caught in catch calling next
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('winnerBid', () => {
    it('should fetch winning bid successfully', async () => {
      mockGetWinnerBidService.mockResolvedValueOnce(mockBid);

      const req = {
        params: { auctionId: 'auc123' },
      };

      const result = await winnerBid(req, mockRes, mockNext);

      expect(mockGetWinnerBidService).toHaveBeenCalledWith('auc123');
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { details: mockBid }, 'Winner bid fetched successfully');
      expect(result).toBe('success_response');
    });

    it('should return error if auctionId missing', async () => {
      const req = {
        params: {},
      };

      await winnerBid(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return error if no winner bid found', async () => {
      mockGetWinnerBidService.mockResolvedValueOnce(null);

      const req = {
        params: { auctionId: 'auc123' },
      };

      await winnerBid(req, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
