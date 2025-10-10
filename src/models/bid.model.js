import { Schema, model } from 'mongoose';

const bidSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value > 0,
        message: 'Bid amount must be greater than zero.'
      }
    },
    dealer_id: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    auction_id: {
      type: Schema.Types.ObjectId,
      ref: 'Auction',
      required: true
    },
    previous_bid_id: {
      type: Schema.Types.ObjectId,
      ref: 'Bid',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for fast retrieval of last bid per auction
bidSchema.index({ auction_id: 1, createdAt: -1 });

export default model('Bid', bidSchema);
