import express from 'express';
import { getAllBookmarks, addBookmark, deleteBookmark } from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', getAllBookmarks);
router.post('/', addBookmark);
router.delete('/:id', deleteBookmark);

export default router;