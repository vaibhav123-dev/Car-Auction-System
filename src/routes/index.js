import express from 'express';
import userRoutes from './user.routes.js';
import auctionRoutes from './auction.routes.js';
import carRoutes from './car.routes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/auction', auctionRoutes);
router.use('/car', carRoutes);

export default router;
