import dbConnection from '../dbConnection';


/**
 * DB interfacing utilities for organizations table
 */
export default class Organizations {
  /**
   * retrieves the id of all organization in the db
   * @returns {number[]}
   */
  static async getNamesAndIds() {
    const { rows } = await dbConnection.dbConnect('SELECT id, name FROM organizations');
    return rows;
  }
}
