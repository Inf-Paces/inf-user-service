import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../';
import { mockUser1 } from '../../db/mocks/users.mock';
import { successStatus, code200, errorStatus, emailValidationError, passwordValidationError, orgIdValidationError, signinError, internalServerError } from '../../helpers/constants';
import Organizations from '../../db/organizations';
import Sinon from 'sinon';
import Users from '../../db/users';


chai.use(chaiHttp);
const { expect } = chai;
const authUrl = '/api/v1/auth';
const loginUrl = `${authUrl}/login`;
const { email, password } = mockUser1;
let org;

before((done) => {
  Organizations.getNamesAndIds()
    .then((rows) => {
      org = rows[0];
      done();
    })
    .catch((error) => done(error));
});


describe(`POST ${loginUrl}`, () => {
  const loginRequest = chai.request(app).post(loginUrl);

  describe('SUCCESS', () => {
    it('signs in a user successfully', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password, organization: org.id });

      expect(res.status).to.equal(code200);
      expect(res.body).to.be.an('object').and.to.have.keys('status', 'data');
      expect(res.body.status).to.equal(successStatus);
      expect(res.body.data).to.be.an('object').and.to.have.keys(
        'first_name', 'last_name', 'email', 'phone', 'address', 'city',
        'state', 'address_description', 'role', 'activated', 'created_by',
        'last_updated_by', 'created_at', 'updated_at', 'org_name'
      );
      expect(res.body.data.email).to.equal(email);
      expect(res.body.data.org_name).to.equal(org.name);
    });
  });
  
  describe('FAILURE', () => {
    it('fails to sign in user due to no email field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ password, organization: org.id });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('email');
      expect(res.body.error[0].email).to.equal(emailValidationError);
    });
    
    it('fails to sign in user due to invalid email field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email: 'abcd@gmail', password, organization: org.id });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('email');
      expect(res.body.error[0].email).to.equal(emailValidationError);
    });
    
    it('fails to sign in user due to no password field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, organization: org.id });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('password');
      expect(res.body.error[0].password).to.equal(passwordValidationError);
    });
    
    it('fails to sign in user due to invalid password field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password: '1234', organization: org.id });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('password');
      expect(res.body.error[0].password).to.equal(passwordValidationError);
    });
    
    it('fails to sign in user due to no organization field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('organization');
      expect(res.body.error[0].organization).to.equal(orgIdValidationError);
    });
    
    it('fails to sign in user due to invalid organization id field', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password, organization: 2.5 });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('array').and.to.have.length(1)
      expect(res.body.error[0]).to.be.an('object').and.have.key('organization');
      expect(res.body.error[0].organization).to.equal(orgIdValidationError);
    });
    
    it('fails to sign in user due to email not existent in the records', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email: 'abc@efg.com', password, organization: org.id });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('object').and.have.key('message');
      expect(res.body.error.message).to.equal(signinError);
    });

    it('fails to sign in user due to wrong password', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password: 'abcdefghijk', organization: org.id });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('object').and.have.key('message');
      expect(res.body.error.message).to.equal(signinError);
    });
    
    it('fails to sign in user due to non-existent organization', async () => {
      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password: 'abcdefghijk', organization: 2000 });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('object').and.have.key('message');
      expect(res.body.error.message).to.equal(signinError);
    });
    
    it('fails to sign in user due to internal server error', async () => {
      const stub = Sinon.stub(Users, 'getUser').throws(new Error());

      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password: 'abcdefghijk', organization: 2000 });

      expect(res.status).to.equal(500);
      expect(res.body).to.be.an('object').and.to.key('status', 'error');
      expect(res.body.status).to.equal(errorStatus);
      expect(res.body.error).to.be.an('object').and.have.key('message');
      expect(res.body.error.message).to.equal(internalServerError);

      stub.restore();
    });
  });
});
