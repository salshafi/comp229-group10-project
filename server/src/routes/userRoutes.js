import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', protect, adminOnly, getUsers);
router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, adminOnly, deleteUser);
export default router;
