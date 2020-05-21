import dbConnection from './dbConnection';
import {
  dropCreateOrgFunction, dropOrgUserTable,
  dropUserRolesType, dropUsersTable, dropOrganizationsTable, dropCreateUserFunction,
} from '../helpers/constants';

(async () => {
  try {
    await dbConnection.dbConnect(dropCreateUserFunction);
    await dbConnection.dbConnect(dropCreateOrgFunction);
    await dbConnection.dbConnect(dropOrgUserTable);
    await dbConnection.dbConnect(dropOrganizationsTable);
    await dbConnection.dbConnect(dropUsersTable);
    await dbConnection.dbConnect(dropUserRolesType);
  } catch (error) {
    console.log(error.message);
  }
})();
