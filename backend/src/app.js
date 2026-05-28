import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';


const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());

export default app;
