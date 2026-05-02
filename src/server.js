import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import pino from 'pino-http';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
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

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.get('/notes', (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId} ` });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {


  res.status(500).json({
    message: "<повідомлення про помилку>"
  });

});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});
