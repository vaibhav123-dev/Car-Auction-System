import ApiResponse from '../utils/apiResponse.js';
import {
  createCarService,
  updateCarService,
  deleteCarService,
  getCarByIdService,
  getCarsService,
} from '../services/car.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createCarSchema, updateCarSchema } from '../validations/car.validation.js';

export const createCar = asyncHandler(async (req, res) => {
  const carData = req.body;
  const userId = req.user._id;

  await createCarSchema.validateAsync(carData);

  const car = await createCarService(carData, userId);

  return ApiResponse.created(res, { car }, 'Car created successfully');
});

export const updateCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user._id;

  await updateCarSchema.validateAsync(updateData);

  const car = await updateCarService(id, updateData, userId);

  return ApiResponse.success(res, { car }, 'Car updated successfully');
});

export const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const car = await deleteCarService(id, userId);

  return ApiResponse.success(res, { car }, 'Car deleted successfully');
});

export const getCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await getCarByIdService(id);

  return ApiResponse.success(res, { car }, 'Car retrieved successfully');
});

export const getCars = asyncHandler(async (req, res) => {
  // Extract query parameters for filtering
  const { make, model, year, minPrice, maxPrice, status } = req.query;

  const filters = {};
  if (make) filters.make = make;
  if (model) filters.model = model;
  if (year) filters.year = parseInt(year);
  if (status) filters.status = status;

  // Price range filter
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = parseInt(minPrice);
    if (maxPrice) filters.price.$lte = parseInt(maxPrice);
  }

  const cars = await getCarsService(filters);

  return ApiResponse.success(res, { cars }, 'Cars retrieved successfully');
});
