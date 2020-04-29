import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../';
import { welcomeMessage, code200, code404, routeNotFoundError, errorStatus } from '../helpers/constants';

chai.use(chaiHttp);
const { expect } = chai;

describe('Sample test', () => {
  it('should return a 200', async () => {
    const res = await chai.request(app)
      .get('/')
      .send();
    
    expect(res.status).to.equal(code200);
    expect(res.text).to.be.an('string').and.to.equal(welcomeMessage);
  });

  it('should send options', async () => {
    await chai.request(app)
      .options('/')
      .send();
  });

  it('should return 404', async () => {
    const res = await chai.request(app)
      .get('/someweirdroute')
      .send();
    
    expect(res.status).to.equal(code404);
    expect(res.body).to.be.an('object').and.to.have.keys('status', 'error');
    expect(res.body.status).to.equal(errorStatus);
    expect(res.body.error).to.be.an('object').and.to.have.key('message');
    expect(res.body.error.message).to.equal(routeNotFoundError);
  });
})
