import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js'
import cors from "cors";
import transactionRouter from './routes/transaction.routes.js'
import aiRouter from './routes/ai.routes.js';


const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  // origin: 'https://expense-ai-jet.vercel.app',
   origin: [
    "http://localhost:5173",
    "https://expense-ai-jet.vercel.app"
  ],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions',transactionRouter)
app.use('/api/ai',aiRouter)
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
