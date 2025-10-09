import Joi from 'joi'

export const bidValidationSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than zero',
      'any.required': 'Amount is required'
    }),

  auction_id: Joi.string()
    .required()
    .messages({
      'string.base': 'Auction ID must be a string',
      'any.required': 'Auction ID is required'
    }),

  dealer_id: Joi.string()
    .required()
    .messages({
      'any.required': 'Dealer ID is required'
    }),

  previous_bid: Joi.object({
    amount: Joi.number(),
    dealer_id: Joi.string(),
    timestamp: Joi.date()
  }).optional()
});
