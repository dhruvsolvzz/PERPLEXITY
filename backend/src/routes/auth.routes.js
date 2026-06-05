import { Router } from 'express';
import { register , verifyEmailController , loginController , getMeController } from '../controllers/auth.controllers.js';
import { registerValidationRules, handleValidationErrors ,loginValidationRules} from '../validators/auth.validators.js';
import { authUser } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerValidationRules, handleValidationErrors, register);
authRouter.get('/verify-email', verifyEmailController);
authRouter.post('/login', loginValidationRules, handleValidationErrors, loginController); 
authRouter.get('/protected', authUser,getMeController)
export default authRouter;


