import express from 'express';
import userRoutes from './user.routes.js';
import auctionRoutes from './auction.routes.js';
import carRoutes from './car.routes.js';

const router = express.Router();
import bidRouter from './bid.routes.js'


const router = express.Router();
// import carRoutes from './car.routes.js';

router.use('/user', userRoutes);
router.use('/auction', auctionRoutes);
router.use('/car', carRoutes);

router.use('/auction', bidRouter)
// router.use('/cars', carRoutes)
export default router;
