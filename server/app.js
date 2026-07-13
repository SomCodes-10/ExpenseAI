import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js'
import cors from "cors";
import transactionRouter from './routes/transaction.routes.js'

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions',transactionRouter)
app.use(errorHandler);


const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log('Failed to start server:', error);
  }
};

startServer();
