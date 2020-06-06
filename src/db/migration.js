import { debug as createDebugger } from 'debug';

import dbConnection from './dbConnection';
import envVariables from '../environment';
import {
  createOrganizationsTableQuery, createUserOrgTable, createInfPacesQuery,
  createUserRolesTypeQuery, createUsersTableQuery,
  createOrganizationFunctionQuery, createUserFunctionQuery,
} from '../helpers/queries';
import authHelpers from '../helpers/authHelpers';
import debugHelper from '../helpers/debugHelper';


const debug = createDebugger('app:migration');
const {
  adminEmail, adminPassword, adminPhone, infName,
} = envVariables;

(async () => {
  try {
    await dbConnection.dbConnect(createUserRolesTypeQuery);
    await dbConnection.dbConnect(createUsersTableQuery);
    await dbConnection.dbConnect(createOrganizationsTableQuery);
    await dbConnection.dbConnect(createUserOrgTable);
    await dbConnection.dbConnect(createUserFunctionQuery);
    await dbConnection.dbConnect(createOrganizationFunctionQuery);
    const password = await authHelpers.hashPassword(adminPassword);
    await dbConnection.dbConnect(...createInfPacesQuery(
      infName, adminEmail, adminPhone, '22 Bolakale Street',
      'Lagos', 'Lagos', null, null, 'Olawumi', 'Yusuff', password,
      adminPhone, '12 Adebimpe Street', 'Lagos', 'Lagos', null, true,
    ));
  } catch (error) {
    debugHelper.error(debug, error);
  }
})();
