import { Router } from 'express';
import { register } from '../controllers/auth.controllers.js';
import { registerValidationRules, handleValidationErrors } from '../validators/auth.validators.js';

const authRouter = Router();

authRouter.post('/register', registerValidationRules, handleValidationErrors, register);

export default authRouter;


