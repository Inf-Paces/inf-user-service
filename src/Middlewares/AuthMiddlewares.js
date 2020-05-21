import { validationResult } from 'express-validator';
import requestValidators from '../helpers/requestValidators';
import { extractValidationErrors } from '../helpers/errorHelpers';
import Responses from '../helpers/responseHelper';


export default class {
  /**
   * Validates the signup request payload
   * @returns {array}
   */
  static validateSignUpBody() {
    // address, city, state, addressDescription,
    return [
      requestValidators.email,
      requestValidators.phone,
      requestValidators.password,
      requestValidators.lastName,
      requestValidators.firstName,
      requestValidators.organization,
      requestValidators.address,
      requestValidators.city,
      requestValidators.state,
      requestValidators.addressDescription,
      (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          const error = extractValidationErrors(errors);
          return Responses.badRequestError(response, error);
        }

        next();
      },
    ];
  }
}
