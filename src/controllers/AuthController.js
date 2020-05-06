import Users from '../db/users';
import Organizations from '../db/organizations';
import Responses from '../helpers/responseHelper';
import authHelpers from '../helpers/authHelpers';
import { duplicateEmailError, code201, code409 } from '../helpers/constants';


export default class {
  /**
   * Signs a new user up
   * @param {object} request
   * @param {object} response
   * @param {object} next
   */
  static async signup(request, response, next) {
    const {
      firstName, lastName, email, password, organization,
      phone, address, city, state, addressDescription,
    } = request.body;
    try {
      const hashedPassword = await authHelpers.hashPassword(password);
      const user = await Users.createUser(
        firstName, lastName, email, hashedPassword, phone, address, city,
        state, addressDescription, 'customer', false, null, organization,
      );
      user.token = authHelpers.generateToken(user);
      return Responses.success(response, user, code201);
    } catch (error) {
      const responseError = new Error();
      if (error.message.includes('duplicate key')) {
        responseError.status = code409;
        responseError.message = duplicateEmailError;
      }
      next(responseError);
    }
  }

  /**
   * Retrieves all organization ids
   * @param {object} request
   * @param {object} response
   * @param {function} next
   */
  static async getOrganizations(request, response, next) {
    try {
      const ids = await Organizations.getNamesAndIds();
      return Responses.success(response, ids);
    } catch (error) {
      next(new Error());
    }
  }
}
