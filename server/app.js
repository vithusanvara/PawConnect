import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import users from './routes/users.js';
import pets from './routes/pets.js';

const app = express();
const dist = fileURLToPath(new URL('../dist', import.meta.url));
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use('/api/users', users);
app.use('/api/pets', pets);
app.use('/api', (_req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
app.use(express.static(dist));
app.get('/', (_req, res) => res.sendFile(path.join(dist, 'index.html')));

app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: 'An account with that email already exists.' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map(item => item.message).join(' ') });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid record ID.' });
  if (error.status === 400 || error.status === 413) return res.status(error.status).json({ message: 'Invalid request body.' });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Try again shortly.' });
});

export default app;
