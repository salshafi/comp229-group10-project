import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.route('/').get(getItems).post(protect, createItem);
router.route('/:id').get(getItem).put(protect, updateItem).delete(protect, deleteItem);
export default router;
