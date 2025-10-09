import { Schema, model } from 'mongoose';

const auctionSchema = new Schema(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'upcoming', 'active', 'ended', 'cancelled'],
      default: 'draft',
    },
  },
  { timestamps: true },
);

export default model('Auction', auctionSchema);
