import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import BadRequestError from "../errors/badRequest.error.js";

const registrationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages({
      'string.alphanum': 'Username must only contain letters and numbers.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username cannot exceed 30 characters.',
      'any.required': 'Username is required.'
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov'] } })
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    // Enforces at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.'
    })
});
const validateRegisterUser = (req, res, next) => {
  // abortEarly: false collects ALL validation errors instead of stopping at the first one
  const { error, value } = registrationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Map the errors into a clean array of strings
    const errorMessages = error.details.map(err => err.message);
    throw new BadRequestError(errorMessages)
  }
 req.body = value;
  
  next();
}

export default validateRegisterUser;