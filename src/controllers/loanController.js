import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  async createLoan(req, res) {
    const { book_id, member_id, due_date } = req.body;
    try {
      const loan = await LoanModel.createLoan(book_id, member_id, due_date);
      res.status(201).json({
        message: "Peminjaman berhasil dicatat!",
        data: loan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getLoans(req, res) {
    try {
      const loans = await LoanModel.getAllLoans();
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async returnLoan(req, res) {
    const { loan_id, return_date } = req.body;
    try {
      if (!loan_id) {
        return res.status(400).json({ error: "loan_id is required" });
      }
      const actualReturnDate = return_date || new Date().toISOString();
      const updatedLoan = await LoanModel.returnLoan(loan_id, actualReturnDate);
      res.json({
        message: "Buku berhasil dikembalikan!",
        data: updatedLoan
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getTopBorrowers(req, res) {
    try {
      const topBorrowers = await LoanModel.getTopBorrowers();
      res.json({
        message: "Top 3 peminjam buku berhasil diambil",
        data: topBorrowers
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};