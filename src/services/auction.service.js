import Auction from '../models/auction.model.js';
import Car from '../models/car.model.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';

/**
 * Creates a new auction in draft status
 * @param {Object} auctionData - The auction details
 * @returns {Object} Created auction data
 */
export const createAuctionService = async (auctionData) => {
  const { carId } = auctionData;

  // Check if car exists
  const car = await Car.findById(carId);
  if (!car) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Car not found');
  }

  // Check if car is already in an active auction
  const existingAuction = await Auction.findOne({
    carId,
    status: { $in: ['draft', 'upcoming', 'active'] },
  });

  if (existingAuction) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      'This car is already in an active or upcoming auction',
    );
  }

  // Create new auction in draft status
  const auction = await Auction.create({
    ...auctionData,
    status: 'draft',
  });

  return auction;
};

/**
 * Starts an auction by changing its status to upcoming or active
 * @param {String} auctionId - The auction ID
 * @returns {Object} Updated auction data
 */
export const startAuctionService = async (auctionId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Auction not found');
  }

  if (auction.status !== 'draft') {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Cannot start auction that is already in ${auction.status} status`,
    );
  }

  const now = new Date();

  // Set status based on start time
  if (now >= auction.startTime && now <= auction.endTime) {
    auction.status = 'active';
  } else if (now < auction.startTime) {
    auction.status = 'upcoming';
  } else {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot start auction with end time in the past');
  }

  await auction.save();

  return auction;
};

/**
 * Updates an auction
 * @param {String} auctionId - The auction ID
 * @param {Object} updateData - The data to update
 * @returns {Object} Updated auction data
 */
export const updateAuctionService = async (auctionId, updateData) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Auction not found');
  }

  // Only allow updates if auction is in draft status
  if (auction.status !== 'draft') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot update auction that has already started');
  }

  // Update auction
  Object.assign(auction, updateData);
  await auction.save();

  return auction;
};

/**
 * Gets an auction by ID
 * @param {String} auctionId - The auction ID
 * @returns {Object} Auction data
 */
export const getAuctionByIdService = async (auctionId) => {
  const auction = await Auction.findById(auctionId).populate('carId');

  if (!auction) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Auction not found');
  }

  return auction;
};

/**
 * Gets all auctions with optional filters
 * @param {Object} filters - Optional filters
 * @returns {Array} Array of auctions
 */
export const getAuctionsService = async (filters = {}) => {
  const auctions = await Auction.find(filters).populate('carId');

  return auctions;
};
