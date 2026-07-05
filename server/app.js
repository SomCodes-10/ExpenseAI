import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import healthRouter from './routes/health.js';

dotenv.config()

const app = express();
const port = 3000;

app.use(express.json())
app.use('/api/health', healthRouter)


const startServer = async () => {
  try {
    await connectDB()

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  }catch(error){
    console.log("Failed to start server:",error)
  }
}

startServer();