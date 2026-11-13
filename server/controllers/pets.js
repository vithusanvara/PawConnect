import Pet from '../models/Pet.js';

const fields = ['name', 'species', 'age', 'location', 'description', 'image', 'status'];

function petData(body) {
  return Object.fromEntries(fields.filter(field => Object.hasOwn(body ?? {}, field)).map(field => [field, body[field]]));
}

export async function list(req, res) {
  res.json(await Pet.find().sort({ createdAt: -1 }));
}

export async function mine(req, res) {
  res.json(await Pet.find({ owner: req.user.id }).sort({ createdAt: -1 }));
}

export async function read(req, res) {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: 'Pet listing not found.' });
  res.json(pet);
}

export async function create(req, res) {
  const pet = await Pet.create({ ...petData(req.body), owner: req.user.id });
  res.status(201).json(pet);
}

export async function update(req, res) {
  const pet = await Pet.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, { $set: petData(req.body) }, { new: true, runValidators: true });
  if (!pet) return missingOrForbidden(req, res);
  res.json(pet);
}

export async function remove(req, res) {
  const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!pet) return missingOrForbidden(req, res);
  res.sendStatus(204);
}

async function missingOrForbidden(req, res) {
  if (await Pet.exists({ _id: req.params.id })) {
    return res.status(403).json({ message: 'Only the account that posted this listing can change it.' });
  }
  res.status(404).json({ message: 'Pet listing not found.' });
}
