import { debug as createDebugger } from 'debug';

import dbConnection from './dbConnection';
import {
  dropCreateOrgFunction, dropOrgUserTable,
  dropUserRolesType, dropUsersTable, dropOrganizationsTable, dropCreateUserFunction,
} from '../helpers/queries';
import debugHelper from '../helpers/debugHelper';


const debug = createDebugger('app:undoMigration');

(async () => {
  try {
    await dbConnection.dbConnect(dropCreateUserFunction);
    await dbConnection.dbConnect(dropCreateOrgFunction);
    await dbConnection.dbConnect(dropOrgUserTable);
    await dbConnection.dbConnect(dropOrganizationsTable);
    await dbConnection.dbConnect(dropUsersTable);
    await dbConnection.dbConnect(dropUserRolesType);
  } catch (error) {
    debugHelper.error(debug, error);
  }
})();
