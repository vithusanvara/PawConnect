import mongoose from 'mongoose';
import app from './app.js';

if (!process.env.MONGODB_URI || (process.env.JWT_SECRET?.length ?? 0) < 32) {
  throw new Error('Set MONGODB_URI and a JWT_SECRET of at least 32 characters in .env.');
}
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`PawConnect listening on port ${port}`));
