import { body } from 'express-validator';

import { nameRegex, phoneRegex } from './regexPatterns';
import {
  emailValidationError, passwordValidationError, phoneValidationError,
  orgIdValidationError, addressDescriptionValidationError, addressValidationError,
  cityValidationError, stateValidationError, lastNameValidationError, firstNameValidationError,
} from './constants';


export default {
  email: body('email').isEmail().withMessage(emailValidationError),
  password: body('password').isLength({ min: 8 }).withMessage(passwordValidationError),
  firstName: body('firstName').matches(nameRegex).withMessage(firstNameValidationError),
  lastName: body('lastName').matches(nameRegex).withMessage(lastNameValidationError),
  phone: body('phone').matches(phoneRegex).withMessage(phoneValidationError),
  organization: body('organization').isInt().withMessage(orgIdValidationError),
  address: body('address').if(body('address').exists()).isString().withMessage(addressValidationError),
  city: body('city').if(body('city').exists()).isString().withMessage(cityValidationError),
  state: body('state').if(body('state').exists()).isString().withMessage(stateValidationError),
  addressDescription: body('addressDescription').if(body('addressDescription').exists())
    .isString().withMessage(addressDescriptionValidationError),
};
