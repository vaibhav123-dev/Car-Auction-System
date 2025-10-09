import Joi from 'joi';

const createCarSchema = Joi.object({
  make: Joi.string().required().messages({
    'string.empty': 'Make is required',
    'any.required': 'Make is required',
  }),

  model: Joi.string().required().messages({
    'string.empty': 'Model is required',
    'any.required': 'Model is required',
  }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1900 or later',
      'number.max': `Year cannot be later than ${new Date().getFullYear() + 1}`,
      'any.required': 'Year is required',
    }),

  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),

  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),

  images: Joi.array().items(Joi.string()).default([]).messages({
    'array.base': 'Images must be an array',
  }),
});

const updateCarSchema = Joi.object({
  make: Joi.string().messages({
    'string.empty': 'Make cannot be empty',
  }),

  model: Joi.string().messages({
    'string.empty': 'Model cannot be empty',
  }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1900 or later',
      'number.max': `Year cannot be later than ${new Date().getFullYear() + 1}`,
    }),

  price: Joi.number().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
  }),

  description: Joi.string().messages({
    'string.empty': 'Description cannot be empty',
  }),

  images: Joi.array().items(Joi.string()).messages({
    'array.base': 'Images must be an array',
  }),

  status: Joi.string().valid('available', 'in_auction', 'sold').messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of: available, in_auction, sold',
  }),
});

export { createCarSchema, updateCarSchema };
