import dbConnection from './dbConnection';
import envVariables from '../environment';
import {
  createOrganizationsTableQuery, createUserOrgTable, createInfPacesQuery,
  createUserRolesTypeQuery, createUsersTableQuery, createOrganizationFunctionQuery,
} from '../helpers/constants';
import authHelpers from '../helpers/authHelpers';


const { adminEmail, adminPassword, adminPhone } = envVariables;

(async () => {
  try {
    await dbConnection.dbConnect(createUserRolesTypeQuery);
    await dbConnection.dbConnect(createUsersTableQuery);
    await dbConnection.dbConnect(createOrganizationsTableQuery);
    await dbConnection.dbConnect(createUserOrgTable);
    await dbConnection.dbConnect(createOrganizationFunctionQuery);
    const password = await authHelpers.hashPassword(adminPassword);
    await dbConnection.dbConnect(...createInfPacesQuery(
      'Inf Paces', adminEmail, adminPhone, '22 Bolakale Street',
      'Lagos', 'Lagos', null, null, 'Olawumi', 'Yusuff', password,
      adminPhone, '12 Adebimpe Street', 'Lagos', 'Lagos', null, true,
    ));
  } catch (error) {
    console.log(error.message);
  }
})();
