import { Schema, model } from 'mongoose';

const bidSchema = new Schema({
  amount: { type: Number, required: true },
  previous_bid: {
    amount: { type: Number },
    dealer_id: { type: String },
    timestamp: { type: Date }
  },
  dealer_id: { type: String, required: true },
  auction_id: { type: String, required: true }
}, {
  timestamps: true
});

export default model('Bid', bidSchema);
