import { Router } from 'express';
import AuthMiddlewares from '../../Middlewares/AuthMiddlewares';
import AuthController from '../../controllers/AuthController';


const authRouter = Router();

authRouter.get('/', AuthController.getOrganizations);
authRouter.post('/register', ...AuthMiddlewares.validateSignupBody(), AuthController.signup);
authRouter.post('/login', ...AuthMiddlewares.validateSigninBody(), AuthController.signin);


export default authRouter;
