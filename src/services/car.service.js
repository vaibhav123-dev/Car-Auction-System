import Car from '../models/car.model.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';

/**
 * Creates a new car
 * @param {Object} carData - The car details
 * @param {String} userId - The ID of the user creating the car
 * @returns {Object} Created car data
 */
export const createCarService = async (carData, userId) => {
  // Create new car with owner set to the current user
  const car = await Car.create({
    ...carData,
    owner: userId,
  });

  return car;
};

/**
 * Updates a car
 * @param {String} carId - The car ID
 * @param {Object} updateData - The data to update
 * @param {String} userId - The ID of the user updating the car
 * @returns {Object} Updated car data
 */
export const updateCarService = async (carId, updateData, userId) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Car not found');
  }

  // Check if the user is the owner of the car
  if (car.owner.toString() !== userId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You are not authorized to update this car');
  }

  // Check if car is in auction
  if (car.status === 'in_auction') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot update car that is currently in auction');
  }

  // Update car
  Object.assign(car, updateData);
  await car.save();

  return car;
};

/**
 * Deletes a car
 * @param {String} carId - The car ID
 * @param {String} userId - The ID of the user deleting the car
 * @returns {Object} Deleted car data
 */
export const deleteCarService = async (carId, userId) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Car not found');
  }

  // Check if the user is the owner of the car
  if (car.owner.toString() !== userId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You are not authorized to delete this car');
  }

  // Check if car is in auction
  if (car.status === 'in_auction') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete car that is currently in auction');
  }

  await car.deleteOne();

  return car;
};

/**
 * Gets a car by ID
 * @param {String} carId - The car ID
 * @returns {Object} Car data
 */
export const getCarByIdService = async (carId) => {
  const car = await Car.findById(carId).populate('owner', 'name email');

  if (!car) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Car not found');
  }

  return car;
};

/**
 * Gets all cars with optional filters
 * @param {Object} filters - Optional filters
 * @returns {Array} Array of cars
 */
export const getCarsService = async (filters = {}) => {
  const cars = await Car.find(filters).populate('owner', 'name email');

  return cars;
};

/**
 * Updates car status
 * @param {String} carId - The car ID
 * @param {String} status - The new status
 * @returns {Object} Updated car data
 */
export const updateCarStatusService = async (carId, status) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Car not found');
  }

  car.status = status;
  await car.save();

  return car;
};
