import { Pool } from 'pg';

import envVariables from '../environment';

const { dbConnectionString: connectionString } = envVariables;
const pool = new Pool({ connectionString });

export default class dbConnection {
  static dbConnect(query, data) {
    return pool.connect()
      .then((client) => client.query(query, data).finally(() => client.release()));
  }
}
