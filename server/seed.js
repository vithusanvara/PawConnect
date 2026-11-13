import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Pet from './models/Pet.js';
import { samplePets } from '../src/samplePets.js';

const password = process.env.DEMO_PASSWORD;
if (!password || password.length < 8 || Buffer.byteLength(password) > 72) throw new Error('Set a demo password between 8 and 72 bytes.');
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
try {
  const passwordHash = await bcrypt.hash(password, 12);
  const accounts = await Promise.all(['maple', 'cedar'].map(rescue =>
    User.findOneAndUpdate(
      { email: `${rescue}@example.test` },
      { $setOnInsert: { name: `${rescue} rescue`, role: 'staff', passwordHash } },
      { upsert: true, new: true, runValidators: true }
    )
  ));
  await Pet.bulkWrite(samplePets.map((pet, index) => {
    const owner = accounts[index % accounts.length].id;
    return { updateOne: { filter: { owner, name: pet.name }, update: { $setOnInsert: { ...pet, owner } }, upsert: true } };
  }));
  console.log('Demo accounts and pet listings are ready.');
} finally {
  await mongoose.disconnect();
}
