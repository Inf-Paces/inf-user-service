import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import envVariables from '../environment';


const { jwtSecret } = envVariables;

/**
 * Defines methods that handle jwt operations
 */
export default class {
  /**
   * Signs a user credentials and returns a token
   * @param {object} user
   * @returns {string} token
   */
  static generateToken({ id: userId, email: userEmail }) {
    return jwt.sign({ userId, userEmail }, jwtSecret);
  }

  // /**
  //  * Verifies user token
  //  * @param {string} token
  //  */
  // static verifyToken(token) {
  //   return jwt.verify(token, jwtSecret);
  // }

  /**
   * Hashes a password string
   * @param {string} password
   * @returns {Promise}
   */
  static async hashPassword(password) { return bcrypt.hash(password, 10); }

  static async verifyPassword(password, storedPassword) {
    return bcrypt.compare(password, storedPassword);
  }
}
