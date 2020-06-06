import {
  errorStatus, successStatus, code400, code200, code401,
} from './constants';


export default class Responses {
  /**
   * Utility function for bad request error
   * @param {object} response
   * @param {object} error
   * @param {number} code
   */
  static badRequestError(response, error, code = code400) {
    return response.status(code).json({ status: errorStatus, error });
  }

  /**
   * Utility function for success responses
   * @param {object} response
   * @param {object} data
   * @param {number} code
   */
  static success(response, data, code = code200) {
    return response.status(code).json({ status: successStatus, data });
  }

  static unauthorizedError(response, error, code = code401) {
    return response.status(code).json({ status: errorStatus, error });
  }
}
