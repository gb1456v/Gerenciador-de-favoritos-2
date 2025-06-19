import express from 'express';
import { getAllTags, addTag, deleteTag } from '../controllers/tagController.js';

const router = express.Router();

router.get('/', getAllTags);
router.post('/', addTag);
router.delete('/:id', deleteTag);

export default router;