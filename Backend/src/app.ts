import express from 'express';
import userRoutes from './routes/user';
import compressionRoutes from './routes/compression';
import { validateJson } from './middlewares/validation';
import cors from 'cors';

const app = express();

// Accept only valid JSON requests
app.use(express.json());
app.use(validateJson);
app.use(cors());
app.use(express.static('public'));

// Define routes
app.use('/user', userRoutes);
app.use('/compression', compressionRoutes);

export default app;