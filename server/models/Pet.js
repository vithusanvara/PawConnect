import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  species: { type: String, required: true, enum: ['Dog', 'Cat'] },
  age: { type: String, required: true, trim: true, maxlength: 40 },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  image: { type: String, trim: true, default: '', maxlength: 1000, validate: value => !value || /^https:\/\/[^\s]+$/i.test(value) || /^\/images\/[\w.-]+$/.test(value) },
  status: { type: String, enum: ['Available', 'Adoption Pending', 'Adopted'], default: 'Available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true, index: true }
}, { timestamps: true });

export default mongoose.model('Pet', schema);
