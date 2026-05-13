import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
import 'dotenv/config';
import pino from 'pino-http';
import { connectMongoDB } from './db/connectMongoDB.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
// import { logger } from './middleware/logger.js';
const app = express();
const PORT = process.env.PORT ?? 3000;


app.use(express.json());
app.use(cors(
  { methods: ['GET', 'POST', 'PUT', 'DELETE'] },

));
// app.use(helmet());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);


app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
