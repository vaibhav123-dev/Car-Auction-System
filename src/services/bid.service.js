import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constant.js';
import User from '../models/user.model.js';
import Auction from '../models/auction.model.js';
import Bid from '../models/bid.model.js';

export const placeBidService = async (value) => {
    try {
        const { auctionId, amount, dealerId } = value;

        // Validate auction
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Auction not found');
        }

        // Check auction status
        if (auction.status !== 'active') {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Auction is not active');
        }

        // Validate dealer
        const dealer = await User.findById(dealerId);
        if (!dealer) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
        }
        if (dealer.role !== 'dealer') {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Only dealers can place bids');
        }

        // Check against starting price
        if (amount <= auction.startingPrice) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                'Bid amount must be greater than starting price'
            );
        }

        // Check against last bid
        const lastBid = await Bid.findOne({ auctionId }).sort({ createdAt: -1 });
        if (lastBid && amount <= lastBid.amount) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                'Bid amount must be greater than previous bid'
            );
        }

        // check endTime while placing Bid and update autcion status
        const currentTime = new Date();
        if (currentTime > auction.endTime) {
            auction.status = 'ended';
            await auction.save();
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Auction has already ended');
        }

        // Create new bid record
        const newBid = await Bid.create({
            amount,
            dealer_id:dealerId,
            auction_id:auctionId,
            previous_bid_id: lastBid ? lastBid._id : null,
        });

        // Optionally update auction's highest bid
        auction.highestBid = amount;
        await auction.save();

        // Fetch bid with dealer + previous bid details
        const populatedBid = await Bid.findById(newBid._id)
            .populate('dealer_id', 'name email role')
            .populate('previous_bid_id', 'dealerId amount createdAt');

        return populatedBid;
    } catch (err) {

        if (err instanceof ApiError) throw err;
        console.error(err)
        throw new ApiError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Something went wrong while placing the bid'
        );
    }
};

export const getWinnerBidService = async(auctionId) =>{
    try{
        // Validate auction
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Auction not found');
        }
        // Fetch highest bid for the auction
        const winnerBid = await Bid
            .findOne({ auction_id: auctionId })
            .sort({ amount: -1 })
            .populate('dealer_id', 'name email role');
        return winnerBid;
    }
    catch(err){
        if (err instanceof ApiError) throw err;
        console.error(err)
        throw new ApiError(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Something went wrong while fetching the winner bid'
        );
    }
}
