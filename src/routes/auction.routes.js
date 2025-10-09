import express from 'express';
import {
  createAuction,
  startAuction,
  updateAuction,
  getAuction,
  getAuctions,
} from '../controllers/auction.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Create auction requires admin role, get all auctions is available to all authenticated users
router.route('/').post(requireAdmin, createAuction).get(getAuctions);

// Get is available to all authenticated users
// Update requires admin role
router.route('/:id').get(getAuction).put(requireAdmin, updateAuction);

// Start auction requires admin role
router.route('/:id/start').post(requireAdmin, startAuction);

export default router;
