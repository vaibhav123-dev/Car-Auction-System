import express from 'express'
import {placeBid} from '../controllers/bid.controller.js'

const router = express.Router()

router.route('/placeBids').post(placeBid)

export default router;