import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

export default app;
