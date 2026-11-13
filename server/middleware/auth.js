import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireUser(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  let id;
  try {
    id = jwt.verify(token ?? '', process.env.JWT_SECRET, { algorithms: ['HS256'] }).sub;
  } catch {
    return res.status(401).json({ message: 'Sign in to continue.' });
  }
  req.user = await User.findById(id);
  if (!req.user) return res.status(401).json({ message: 'Sign in to continue.' });
  next();
}

export function requireStaff(req, res, next) {
  if (req.user.role !== 'staff') return res.status(403).json({ message: 'A rescue staff account is required.' });
  next();
}
