import ApiResponse from '../utils/apiResponse.js';
import {
  createAuctionService,
  startAuctionService,
  updateAuctionService,
  getAuctionByIdService,
  getAuctionsService,
} from '../services/auction.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createAuctionSchema, updateAuctionSchema } from '../validations/auction.validation.js';

export const createAuction = asyncHandler(async (req, res) => {
  const auctionData = req.body;

  await createAuctionSchema.validateAsync(auctionData);

  const auction = await createAuctionService(auctionData);

  return ApiResponse.created(res, { auction }, 'Auction created successfully');
});

export const startAuction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const auction = await startAuctionService(id);

  return ApiResponse.success(res, { auction }, 'Auction started successfully');
});

export const updateAuction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate update data
  await updateAuctionSchema.validateAsync(updateData);

  const auction = await updateAuctionService(id, updateData);

  return ApiResponse.success(res, { auction }, 'Auction updated successfully');
});

export const getAuction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const auction = await getAuctionByIdService(id);

  return ApiResponse.success(res, { auction }, 'Auction retrieved successfully');
});

export const getAuctions = asyncHandler(async (req, res) => {
  // Extract query parameters for filtering
  const { status, carId } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (carId) filters.carId = carId;

  const auctions = await getAuctionsService(filters);

  return ApiResponse.success(res, { auctions }, 'Auctions retrieved successfully');
});
