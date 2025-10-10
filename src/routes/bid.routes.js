import express from 'express'
import {placeBid, winnerBid} from '../controllers/bid.controller.js'

const router = express.Router()

router.route('/placeBids').post(placeBid)
router.route('/:auctionId/winner-bid').get(winnerBid)

export default router;