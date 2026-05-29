import { Router } from 'express';
import { register , verifyEmailController } from '../controllers/auth.controllers.js';
import { registerValidationRules, handleValidationErrors } from '../validators/auth.validators.js';

const authRouter = Router();

authRouter.post('/register', registerValidationRules, handleValidationErrors, register);
authRouter.get('/verify-email', verifyEmailController); 
export default authRouter;


