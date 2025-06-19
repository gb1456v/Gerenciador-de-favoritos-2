import express from 'express';
import { getAllCategories, addCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', addCategory);
router.delete('/:id', deleteCategory);

export default router;