import {bidValidationSchema} from '../validations/bid.validation.js'
import  ApiError from '../utils/apiError.js'
import HTTP_STATUS from '../constant.js'
import {placeBidService} from '../services/bid.service.js'
import ApiResponse from '../utils/apiResponse.js'

export const placeBid = async(req,res,next) =>{
    try {
            const { _id } = "741"
    const { error, value } = bidValidationSchema.validate(req.body, { abortEarly: false });
    if(error){
        res.statusCode = HTTP_STATUS.BAD_REQUEST
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, error.details.map(detail => detail.message).join(', '))
    }
    const deatils = await placeBidService(value)
    return ApiResponse.created(res, {deatils}, "Bid added Successfully")
    } catch(err){
        next(err);
    }
}