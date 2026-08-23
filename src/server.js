import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB }  from './db/connectMongoDB.js';
import  logger  from './middlewares/logger.js';
import  notFoundHandler  from './middlewares/notFoundHandler.js';
import  errorHandler  from './middlewares/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

dotenv.config();

export const setupServer = async () => {
  const app = express();

  await connectMongoDB();

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.use(notesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();
