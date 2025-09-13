import { body, validationResult } from 'express-validator';
import { response } from '../utils/response.js';

export const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('addr')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
    
  body('otp')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit number'),
    
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean value')
];

export const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('addr')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
    
  body('otp')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit number'),
    
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean value')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return response(res, errorMessages, 'Validation failed', 422);
  }
  next();
};