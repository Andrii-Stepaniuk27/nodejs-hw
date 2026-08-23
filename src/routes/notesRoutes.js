import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/notes', notesController.getAllNotes);
router.get('/notes/:noteId', notesController.getNoteById);
router.post('/notes', notesController.createNote);
router.patch('/notes/:noteId', notesController.updateNote);
router.delete('/notes/:noteId', notesController.deleteNote);

export default router;
