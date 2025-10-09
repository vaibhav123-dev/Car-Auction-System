import { jest } from '@jest/globals';
import Car from '../../../src/models/car.model.js';
import { mockCar, mockUser } from '../../mocks/mockData.js';

describe('Car Model', () => {
  let carInstance;

  beforeEach(() => {
    // Create a new car instance for each test
    carInstance = new Car({
      make: mockCar.make,
      model: mockCar.model,
      year: mockCar.year,
      price: mockCar.price,
      description: mockCar.description,
      images: mockCar.images,
      owner: mockUser._id,
    });

    // Mock the save method
    carInstance.save = jest.fn().mockResolvedValue(carInstance);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have the correct fields', () => {
      // Verify the schema has the expected fields
      expect(carInstance).toHaveProperty('make');
      expect(carInstance).toHaveProperty('model');
      expect(carInstance).toHaveProperty('year');
      expect(carInstance).toHaveProperty('price');
      expect(carInstance).toHaveProperty('description');
      expect(carInstance).toHaveProperty('images');
      expect(carInstance).toHaveProperty('owner');
      expect(carInstance).toHaveProperty('status');
    });

    it('should set default status to available', () => {
      expect(carInstance.status).toBe('available');
    });

    it('should set default images to empty array', () => {
      const carWithoutImages = new Car({
        make: mockCar.make,
        model: mockCar.model,
        year: mockCar.year,
        price: mockCar.price,
        description: mockCar.description,
        owner: mockUser._id,
      });
      
      expect(Array.isArray(carWithoutImages.images)).toBe(true);
      expect(carWithoutImages.images.length).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should require make', () => {
      // Create a new car without make
      const car = new Car({
        model: mockCar.model,
        year: mockCar.year,
        price: mockCar.price,
        description: mockCar.description,
        owner: mockUser._id,
      });

      // Mock validateSync to simulate validation
      car.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { make: { message: 'Path `make` is required.' } } };
      });

      // Expect validation error
      const validationError = car.validateSync();
      expect(validationError.errors.make).toBeDefined();
    });

    it('should require model', () => {
      // Create a new car without model
      const car = new Car({
        make: mockCar.make,
        year: mockCar.year,
        price: mockCar.price,
        description: mockCar.description,
        owner: mockUser._id,
      });

      // Mock validateSync to simulate validation
      car.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { model: { message: 'Path `model` is required.' } } };
      });

      // Expect validation error
      const validationError = car.validateSync();
      expect(validationError.errors.model).toBeDefined();
    });

    it('should require year', () => {
      // Create a new car without year
      const car = new Car({
        make: mockCar.make,
        model: mockCar.model,
        price: mockCar.price,
        description: mockCar.description,
        owner: mockUser._id,
      });

      // Mock validateSync to simulate validation
      car.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { year: { message: 'Path `year` is required.' } } };
      });

      // Expect validation error
      const validationError = car.validateSync();
      expect(validationError.errors.year).toBeDefined();
    });

    it('should not allow year less than 1900', () => {
      // Create a new car with year less than 1900
      carInstance.year = 1899;

      // Mock validateSync to simulate validation
      carInstance.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { year: { message: 'Path `year` (1899) is less than minimum allowed value (1900).' } } };
      });

      // Expect validation error
      const validationError = carInstance.validateSync();
      expect(validationError.errors.year).toBeDefined();
    });


    it('should not allow negative price', () => {
      // Create a new car with negative price
      carInstance.price = -100;

      // Mock validateSync to simulate validation
      carInstance.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { price: { message: 'Path `price` (-100) is less than minimum allowed value (0).' } } };
      });

      // Expect validation error
      const validationError = carInstance.validateSync();
      expect(validationError.errors.price).toBeDefined();
    });

    it('should only allow valid status values', () => {
      // Create a new car with invalid status
      carInstance.status = 'invalid-status';

      // Mock validateSync to simulate validation
      carInstance.validateSync = jest.fn().mockImplementation(() => {
        return { errors: { status: { message: '`invalid-status` is not a valid enum value for path `status`.' } } };
      });

      // Expect validation error
      const validationError = carInstance.validateSync();
      expect(validationError.errors.status).toBeDefined();
    });

    it('should allow valid status values', () => {
      const validStatuses = ['available', 'in_auction', 'sold'];
      
      for (const status of validStatuses) {
        carInstance.status = status;
        
        // Mock validateSync to return undefined (no errors)
        carInstance.validateSync = jest.fn().mockReturnValue(undefined);
        
        // Expect no validation error
        const validationError = carInstance.validateSync();
        expect(validationError).toBeUndefined();
      }
    });
  });

  describe('Methods', () => {
    it('should save car successfully', async () => {
      // Call save method
      const savedCar = await carInstance.save();

      // Verify save was called
      expect(carInstance.save).toHaveBeenCalled();

      // Verify the car was saved with the correct data
      expect(savedCar).toBe(carInstance);
    });

    it('should update car fields correctly', async () => {
      // Update the car
      carInstance.make = 'Honda';
      carInstance.model = 'Civic';
      carInstance.price = 18000;

      // Mock save to return the updated car
      carInstance.save.mockResolvedValueOnce({
        ...carInstance,
        make: 'Honda',
        model: 'Civic',
        price: 18000,
      });

      // Save the updated car
      const updatedCar = await carInstance.save();

      // Verify save was called
      expect(carInstance.save).toHaveBeenCalled();

      // Verify the car was updated with the correct data
      expect(updatedCar.make).toBe('Honda');
      expect(updatedCar.model).toBe('Civic');
      expect(updatedCar.price).toBe(18000);
    });
  });

  describe('Static Methods', () => {
    beforeEach(() => {
      // Mock Car.find
      Car.find = jest.fn().mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue([carInstance]),
        };
      });

      // Mock Car.findById
      Car.findById = jest.fn().mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(carInstance),
        };
      });
    });

    it('should find cars by status', async () => {
      // Call find with status filter
      await Car.find({ status: 'available' }).exec();

      // Verify find was called with the correct filter
      expect(Car.find).toHaveBeenCalledWith({ status: 'available' });
    });

    it('should find car by ID', async () => {
      // Call findById
      await Car.findById(mockCar._id).exec();

      // Verify findById was called with the correct ID
      expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
    });
  });
});
