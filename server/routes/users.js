import { Router } from 'express';
import { login, me, register } from '../controllers/users.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireUser, me);
export default router;
