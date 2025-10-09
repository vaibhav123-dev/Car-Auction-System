import Joi from 'joi';

const createAuctionSchema = Joi.object({
  carId: Joi.string().required().messages({
    'string.empty': 'Car ID is required',
    'any.required': 'Car ID is required',
  }),

  startingPrice: Joi.number().min(0).required().messages({
    'number.base': 'Starting price must be a number',
    'number.min': 'Starting price cannot be negative',
    'any.required': 'Starting price is required',
  }),

  startTime: Joi.date().iso().required().messages({
    'date.base': 'Start time must be a valid date',
    'date.format': 'Start time must be in ISO format',
    'any.required': 'Start time is required',
  }),

  endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
    'date.base': 'End time must be a valid date',
    'date.format': 'End time must be in ISO format',
    'date.greater': 'End time must be after start time',
    'any.required': 'End time is required',
  }),
});

const updateAuctionSchema = Joi.object({
  startingPrice: Joi.number().min(0).messages({
    'number.base': 'Starting price must be a number',
    'number.min': 'Starting price cannot be negative',
  }),

  startTime: Joi.date().iso().messages({
    'date.base': 'Start time must be a valid date',
    'date.format': 'Start time must be in ISO format',
  }),

  endTime: Joi.date().iso().greater(Joi.ref('startTime')).messages({
    'date.base': 'End time must be a valid date',
    'date.format': 'End time must be in ISO format',
    'date.greater': 'End time must be after start time',
  }),

  status: Joi.string().valid('draft', 'upcoming', 'active', 'ended', 'cancelled').messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of: draft, upcoming, active, ended, cancelled',
  }),
});

export { createAuctionSchema, updateAuctionSchema };
