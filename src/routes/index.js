import { Router } from 'express';

import {
  code200, code404, code500, routeNotFoundError, internalServerError, welcomeMessage,
} from '../helpers/constants';
import v1Router from './v1Routes';


const router = Router();
// home route
router.get('/', (request, response) => {
  response.status(code200).send(welcomeMessage);
});

// v1 routes
router.use('/api/v1', v1Router);

// 404s
router.use((request, response, next) => {
  const error = new Error(routeNotFoundError);
  error.status = code404;
  next(error);
});

// server errors
// eslint-disable-next-line no-unused-vars
router.use((error, request, response, next) => {
  response.status(error.status || code500).json({
    status: 'error',
    error: { message: error.message || internalServerError },
  });
});

export default router;
