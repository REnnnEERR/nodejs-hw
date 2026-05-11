import { Router } from "express";
import { get } from "mongoose";
import { getAllNotes } from "../controllers/noteController.js";
import { getNoteById } from "../controllers/noteController.js";
import { createNote } from "../controllers/noteController.js";

const router = Router();

router.get('/notes', getAllNotes);

router.get('/notes/:noteId', getNoteById);
router.post('/notes', createNote);

export default router;
