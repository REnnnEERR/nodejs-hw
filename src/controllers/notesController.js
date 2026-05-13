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

    throw createHttpError(404, `Note not found`);
  }

  res.status(200).json(note);

};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    throw createHttpError(404, `Note not found`);
  }
  res.status(200).json(note);
};
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, { returnDocument: 'after' });

  if (!note) {
    throw createHttpError(404, `Note not found`);
  };
  res.status(200).json(note);
};
