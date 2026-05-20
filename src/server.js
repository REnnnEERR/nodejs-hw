import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT ?? 3000;


app.use(express.json());
app.use(cors(
  { methods: ['GET', 'POST', 'PUT', 'DELETE'] },

));
// app.use(helmet());
app.use(logger);


app.use(notesRouter);

app.use(notFoundHandler);

app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
