// const Bid = require('../models/bid.model')
import ApiError from '../utils/apiError.js'
import HTTP_STATUS from '../constant.js'

export const placeBidService = async (value, _id)=>{
    try {
        console.log(value)
    } catch(err){
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR,"Internal Server error")
    }
}
