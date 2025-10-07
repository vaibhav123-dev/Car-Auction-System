import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorMiddleware';
import baseRoutes from './routes/index';

const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// --- Routes ---
app.use('/api/v1/', baseRoutes);

// --- Error Handling Middleware ---
app.use(errorHandler);

export default app;
