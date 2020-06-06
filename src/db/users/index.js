import dbConnection from '../dbConnection';


export default class Users {
  /**
   * Creates a new user
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} password
   * @param {string} phone
   * @param {string} address
   * @param {string} city
   * @param {string} state
   * @param {string} addressDescription
   * @param {string} role
   * @param {boolean} activated
   * @param {number} creator
   * @param {number} orgId
   */
  static async createUser(
    firstName, lastName, email, password, phone, address,
    city, state, addressDescription, role, activated, creator, orgId,
  ) {
    const { rows: [user] } = await dbConnection.dbConnect(
      `SELECT * FROM create_user(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) AS f(
        id BIGINT, first_name VARCHAR, last_name VARCHAR, email VARCHAR, phone VARCHAR,
        address VARCHAR, city VARCHAR, state VARCHAR, address_description VARCHAR,
        role user_roles, activated BOOLEAN, created_at TIMESTAMP, updated_at TIMESTAMP
      );`, [
        firstName, lastName, email, password, phone, address,
        city, state, addressDescription, role, activated, creator, orgId,
      ],
    );

    return user;
  }

  /**
   * Retrieves a single user
   * @param {string} email
   * @param {string} password
   * @param {string} organization
   * @returns object
   */
  static async getUser(email, organization) {
    const { rows: [user] } = await dbConnection.dbConnect(
      `
        SELECT u.*, org.name org_name, org.id FROM users u INNER JOIN organization_users org_users
        ON u.id=org_users.user_id INNER JOIN organizations org ON org.id=org_users.organization_id
        WHERE u.email=$1 AND org.id=$2;
      `, [
        email, organization,
      ],
    );

    return user;
  }
}
