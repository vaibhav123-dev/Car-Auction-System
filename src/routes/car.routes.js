import express from 'express';
import { createCar, updateCar, deleteCar, getCar, getCars } from '../controllers/car.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Create car requires admin role, get all cars is available to all authenticated users
router.route('/').post(requireAdmin, createCar).get(getCars);

// Get is available to all authenticated users
// Update and delete require admin role
router.route('/:id').get(getCar).put(requireAdmin, updateCar).delete(requireAdmin, deleteCar);

export default router;
