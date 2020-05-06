import { Router } from 'express';
import AuthMiddlewares from '../../Middlewares/AuthMiddlewares';
import AuthController from '../../controllers/AuthController';


const authRouter = Router();

authRouter.get('/register', AuthController.getOrganizations);
authRouter.post('/register', ...AuthMiddlewares.validateSignUpBody(), AuthController.signup);


export default authRouter;
