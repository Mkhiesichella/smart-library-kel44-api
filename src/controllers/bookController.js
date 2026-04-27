import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const searchTitle = req.query.title || '';
      const books = await BookModel.getAll(searchTitle);
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getBookById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateBook(req, res) {
    try {
      const updatedBook = await BookModel.update(req.params.id, req.body);
      if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
      res.json(updatedBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const deletedBook = await BookModel.delete(req.params.id);
      if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
      res.json({ message: "Buku berhasil dihapus dari sistem." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};