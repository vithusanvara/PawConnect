import { Router } from 'express';
import * as pets from '../controllers/pets.js';
import { requireUser, requireStaff } from '../middleware/auth.js';

const router = Router();
router.get('/', pets.list);
router.get('/mine', requireUser, requireStaff, pets.mine);
router.get('/:id', pets.read);
router.post('/', requireUser, requireStaff, pets.create);
router.patch('/:id', requireUser, requireStaff, pets.update);
router.delete('/:id', requireUser, requireStaff, pets.remove);
export default router;
