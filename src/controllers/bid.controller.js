import { bidValidationSchema } from '../validations/bid.validation.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';
import { placeBidService, getWinnerBidService } from '../services/bid.service.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const placeBid = asyncHandler(async (req, res, next) => {
  try {
     req.body.dealer_id = req.user._id.toString();

    const { error, value } = bidValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    
    const values = {
      auctionId: value.auction_id,
      dealerId: value.dealer_id,
      amount: value.amount,
    }

    const details = await placeBidService(values);
    if(!details){
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Failed to place bid");
    }

    return ApiResponse.created(res, { details }, 'Bid added successfully');
  } catch (err) {
    next(err);
  }
});

export const winnerBid = asyncHandler(async(req,res,next) => {
  try {
    const {auctionId} = req.params;
    if(!auctionId){
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Auction ID is required");
    }
    // Call service to get winner bid
    const details = await getWinnerBidService(auctionId);
    if(!details){
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "No bids found for this auction");
    }
    return ApiResponse.success(res, {details}, "Winner bid fetched successfully");
  } catch(err){
    console.log(err)
    next(err);
  }
})