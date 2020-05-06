import Organizations from '../organizations';
import { mockUser1 } from './users.mock';
import authHelpers from '../../helpers/authHelpers';
import Users from '../users';

(async () => {
  try {
    const [{ id: organizaitonId }] = await Organizations.getNamesAndIds();
    const mockUser1Password = await authHelpers.hashPassword(mockUser1.password);
    await Users.createUser(
      mockUser1.firstName, mockUser1.lastName, mockUser1.email, mockUser1Password,
      mockUser1.phone, mockUser1.address, mockUser1.city, mockUser1.state,
      mockUser1.addressDescription, 'customer', false, null, organizaitonId,
    );
  // eslint-disable-next-line no-empty
  } catch (error) {}
})();
