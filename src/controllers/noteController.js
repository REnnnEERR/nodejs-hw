import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  // res.status(200).json({ message: "Retrieved all notes" });
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    // return res.status(404).json({ message: `Note with ID: ${noteId} not found` });

    throw createHttpError(404, `Note with ID: ${noteId} not found`);
  }

  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });

};

export const createNote = async (req, res) => {
  const { title, content } = req.body;

  Note.create(req.body);

  const newNote = new Note({ title, content });
  await newNote.save();
  res.status(201).json({ message: 'Note created successfully', note: newNote });
};
