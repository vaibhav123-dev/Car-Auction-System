import Joi from 'joi';

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name must be a text value',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must not exceed 30 characters',
    'any.required': 'Name field is required',
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'in'] } })
    .required()
    .messages({
      'string.base': 'Email must be a text value',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address (must end with .com or .net)',
      'any.required': 'Email field is required',
    }),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+=\\-{}\\[\\]:;"\'<>,.?/`~]{6,30}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be 6–30 characters long and can include letters, numbers, and special characters',
      'string.empty': 'Password is required',
      'any.required': 'Password field is required',
    }),
});

export default userValidationSchema;
