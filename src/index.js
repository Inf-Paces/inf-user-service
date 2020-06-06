import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import Debug from 'debug';

import routes from './routes';

const debug = Debug('app');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors handling
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (request.method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return response.status(200).json({});
  }
  next();
});

app.use('/', routes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
// eslint-disable-next-line no-console
server.listen(PORT, () => debug(`Server listening on PORT: ${PORT}`));

export default app;
