import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;
    const myQuery = Note.find({ userId: req.user._id });
    if (tag) {
      myQuery.where('tag').equals(tag);
    }
    if (search) {
      myQuery.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const [notes, totalNotes] = await Promise.all([
      myQuery.clone().skip(skip).limit(limit),
      Note.countDocuments(myQuery.getQuery()),
    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    res.status(200).json({
      notes,
      page: Number(page),
      perPage: limit,
      totalNotes,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) throw createError(404, 'Note not found');

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!deletedNote) throw createError(404, 'Note not found');

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { returnDocument: 'after' },
    );

    if (!updatedNote) {
      throw createError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
