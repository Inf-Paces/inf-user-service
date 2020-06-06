import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinon from 'sinon';

import app from '../../';
import Organizations from '../../db/organizations';
import { mockUser2 } from '../../db/mocks/users.mock';
import { normalizeSnakeCaseToCamelCase } from '../../helpers/stringHelpers';
import {
  successStatus, errorStatus, internalServerError, code500, code200, code201,
  duplicateEmailError, code409, code400, emailValidationError, phoneValidationError,
  passwordValidationError,
  firstNameValidationError,
  lastNameValidationError,
  orgIdValidationError,
} from '../../helpers/constants';


chai.use(chaiHttp);
const { expect } = chai;
const authUrl = '/api/v1/auth';
const registerUrl = `${authUrl}/register`;
let orgId;

before((done) => {
  Organizations.getNamesAndIds()
    .then(([{ id }]) => {
      orgId = id;
      done();
    })
    .catch((error) => done(error));
});

describe(registerUrl, () => {
  describe('GET', () => {
    describe('SUCCESS', () => {
      it('should retrieve the list of organizations with their names and id', async () => {
        const res = await chai.request(app)
          .get(authUrl)
          .send();

        expect(res.status).to.equal(code200)
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'data');
        expect(res.body.status).to.equal(successStatus);
        expect(res.body.data).to.be.an('array').and.to.not.be.empty;
        expect(res.body.data[0]).to.be.an('object').and.to.have.keys('id', 'name');
      });
    });
    
    describe('FAILURE', () => {
      it('should give a 500 error retrieving the organizations', async () => {
        const stub = Sinon.stub(Organizations, 'getNamesAndIds').throws(new Error());
        const res = await chai.request(app)
          .get(authUrl)
          .send();

        expect(res.status).to.equal(code500);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('object').and.have.key('message');
        expect(res.body.error.message).to.equal(internalServerError);
        stub.restore();
      });
    });
  });
  
  describe('POST', () => {
    describe('SUCCESS', () => {
      it('should register a new user successfully', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, organization: orgId });

        expect(res.status).to.equal(code201);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'data');
        expect(res.body.status).to.equal(successStatus);
        expect(res.body.data).to.have.an('object').and.to.have.keys(
          'first_name', 'last_name', 'email', 'id', 'token',
          'phone', 'address', 'city', 'state', 'role',
          'activated', 'created_at', 'updated_at', 'address_description'
        );
        [
          'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state',
        ].forEach((key) => {
          expect(res.body.data[key]).to.equal(mockUser2[normalizeSnakeCaseToCamelCase(key)]);
        });
      });
    });
    
    describe('FAILURE', () => {
      it('should fail to sign up with a duplicate email', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, organization: orgId });
        
        expect(res.status).to.equal(code409);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('object').and.have.key('message');
        expect(res.body.error.message).to.equal(duplicateEmailError);
      });
      
      it('should fail to sign up with empty email', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, email: undefined, organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const emailError = res.body.error.find((error) => Object.keys(error).includes('email'));
        expect(emailError.email).to.equal(emailValidationError);
      });
      
      it('should fail to sign up with invalid email', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, email: 'q@z', organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const emailError = res.body.error.find((error) => Object.keys(error).includes('email'));
        expect(emailError.email).to.equal(emailValidationError);
      });

      it('should fail to sign up with empty phone number', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, phone: undefined, organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const phoneError = res.body.error.find((error) => Object.keys(error).includes('phone'));
        expect(phoneError.phone).to.equal(phoneValidationError);
      });
      
      it('should fail to sign up with invalid phone number', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, phone: '09011', organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const phoneError = res.body.error.find((error) => Object.keys(error).includes('phone'));
        expect(phoneError.phone).to.equal(phoneValidationError);
      });

      it('should fail to sign up with empty password', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, password: undefined, organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const passwordError = res.body.error.find((error) => Object.keys(error).includes('password'));
        expect(passwordError.password).to.equal(passwordValidationError);
      });

      it('should fail to sign up with invalid password', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, password: '12345', organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const passwordError = res.body.error.find((error) => Object.keys(error).includes('password'));
        expect(passwordError.password).to.equal(passwordValidationError);
      });

      it('should fail to sign up with empty first name', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, firstName: undefined, organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const firstNameError = res.body.error.find((error) => Object.keys(error).includes('firstName'));
        expect(firstNameError.firstName).to.equal(firstNameValidationError);
      });
      
      it('should fail to sign up with invalid first name', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, firstName: 'Olawumi-', organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const firstNameError = res.body.error.find((error) => Object.keys(error).includes('firstName'));
        expect(firstNameError.firstName).to.equal(firstNameValidationError);
      });
      
      it('should fail to sign up with empty last name', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, lastName: undefined, organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const lastNameError = res.body.error.find((error) => Object.keys(error).includes('lastName'));
        expect(lastNameError.lastName).to.equal(lastNameValidationError);
      });

      it('should fail to sign up with invalid first name', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, lastName: 'Olawumi-', organization: orgId });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const lastNameError = res.body.error.find((error) => Object.keys(error).includes('lastName'));
        expect(lastNameError.lastName).to.equal(lastNameValidationError);
      });
      
      it('should fail to sign up with empty organization id', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, organization: undefined });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const orgError = res.body.error.find((error) => Object.keys(error).includes('organization'));
        expect(orgError.organization).to.equal(orgIdValidationError);
      });

      it('should fail to sign up with invalid organization id', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, organization: 2.5 });
        
        expect(res.status).to.equal(code400);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('array');
        const orgError = res.body.error.find((error) => Object.keys(error).includes('organization'));
        expect(orgError.organization).to.equal(orgIdValidationError);
      });
      
      it('should fail to sign up with unknown id for organization', async () => {
        const res = await chai.request(app)
          .post(registerUrl)
          .send({ ...mockUser2, organization: 500 });
        
        expect(res.status).to.equal(code500);
        expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
        expect(res.body.status).to.equal(errorStatus);
        expect(res.body.error).to.be.an('object').and.to.have.key('message');
        expect(res.body.error.message).to.equal(internalServerError);
      });
    });
  });
})
