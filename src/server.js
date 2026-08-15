import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
const logger = PinoHttp({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat:
        '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
      hideObject: true,
    },
  },
});
app.use(logger);


app.get('/notes', (req, res) => {
  res.json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.json({ message: `Retrieved note with ID: ${noteId}` });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal server error',
  });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`Server running on ${port} port`));
