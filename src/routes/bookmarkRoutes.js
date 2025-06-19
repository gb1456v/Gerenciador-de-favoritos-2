import express from 'express';
import { getAllBookmarks, addBookmark, updateBookmark, deleteBookmark } from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', getAllBookmarks);
router.post('/', addBookmark);
router.put('/:id', updateBookmark);
router.delete('/:id', deleteBookmark);

export default router;
