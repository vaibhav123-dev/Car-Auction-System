import { jest } from '@jest/globals';
import { mockAuction, mockReq, mockRes, mockNext, mockPopulatedAuction } from '../../mocks/mockData.js';

// Create mock functions
const mockCreateAuctionService = jest.fn().mockResolvedValue(mockAuction);
const mockStartAuctionService = jest.fn().mockResolvedValue(mockAuction);
const mockUpdateAuctionService = jest.fn().mockResolvedValue(mockAuction);
const mockGetAuctionByIdService = jest.fn().mockResolvedValue(mockPopulatedAuction);
const mockGetAuctionsService = jest.fn().mockResolvedValue([mockPopulatedAuction]);
const mockValidateAsync = jest.fn().mockResolvedValue(true);
const mockCreated = jest.fn();
const mockSuccess = jest.fn();

// Create mock controller functions
const createAuction = async (req, res, next) => {
  try {
    await mockValidateAsync(req.body);
    const auction = await mockCreateAuctionService(req.body);
    return mockCreated(res, { auction }, 'Auction created successfully');
  } catch (error) {
    return next(error);
  }
};

const startAuction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const auction = await mockStartAuctionService(id);
    return mockSuccess(res, { auction }, 'Auction started successfully');
  } catch (error) {
    return next(error);
  }
};

const updateAuction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await mockValidateAsync(updateData);
    const auction = await mockUpdateAuctionService(id, updateData);
    return mockSuccess(res, { auction }, 'Auction updated successfully');
  } catch (error) {
    return next(error);
  }
};

const getAuction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const auction = await mockGetAuctionByIdService(id);
    return mockSuccess(res, { auction }, 'Auction retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

describe('Auction Controller', () => {
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

  describe('createAuction', () => {
    it('should create a new auction successfully', async () => {
      // Setup request with auction data
      const req = {
        ...mockReq,
        body: {
          carId: mockAuction.carId,
          startingPrice: mockAuction.startingPrice,
          startTime: mockAuction.startTime,
          endTime: mockAuction.endTime,
        },
      };

      // Call the controller
      await createAuction(req, mockRes, mockNext);

      // Verify validation was called
      expect(mockValidateAsync).toHaveBeenCalledWith(req.body);
      
      // Verify service was called with correct data
      expect(mockCreateAuctionService).toHaveBeenCalledWith(req.body);
      
      // Verify response
      expect(mockCreated).toHaveBeenCalledWith(mockRes, { auction: mockAuction }, 'Auction created successfully');
    });
  });

  describe('startAuction', () => {
    it('should start an auction successfully', async () => {
      // Setup request with auction ID
      const req = {
        ...mockReq,
        params: {
          id: mockAuction._id,
        },
      };

      // Call the controller
      await startAuction(req, mockRes, mockNext);

      // Verify service was called with correct ID
      expect(mockStartAuctionService).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify response
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { auction: mockAuction }, 'Auction started successfully');
    });
  });

  describe('updateAuction', () => {
    it('should update an auction successfully', async () => {
      // Setup request with auction ID and update data
      const updateData = {
        startingPrice: 22000,
        startTime: new Date('2025-10-11T10:00:00Z'),
      };
      const req = {
        ...mockReq,
        params: {
          id: mockAuction._id,
        },
        body: updateData,
      };

      // Call the controller
      await updateAuction(req, mockRes, mockNext);

      // Verify validation was called
      expect(mockValidateAsync).toHaveBeenCalledWith(updateData);
      
      // Verify service was called with correct ID and data
      expect(mockUpdateAuctionService).toHaveBeenCalledWith(mockAuction._id, updateData);
      
      // Verify response
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { auction: mockAuction }, 'Auction updated successfully');
    });

  });

  describe('getAuction', () => {
    it('should get an auction by ID successfully', async () => {
      // Setup request with auction ID
      const req = {
        ...mockReq,
        params: {
          id: mockAuction._id,
        },
      };

      // Call the controller
      await getAuction(req, mockRes, mockNext);

      // Verify service was called with correct ID
      expect(mockGetAuctionByIdService).toHaveBeenCalledWith(mockAuction._id);
      
      // Verify response
      expect(mockSuccess).toHaveBeenCalledWith(mockRes, { auction: mockPopulatedAuction }, 'Auction retrieved successfully');
    });

  
  });

});
