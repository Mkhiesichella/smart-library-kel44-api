import { pool } from '../config/db.js';

export const ReportModel = {
  async getTopBooks() {
    const query = `
      SELECT b.id, b.title, b.isbn, COUNT(l.id)::int as total_borrowed
      FROM books b
      JOIN loans l ON b.id = l.book_id
      GROUP BY b.id
      ORDER BY total_borrowed DESC
      LIMIT 2
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getLibraryStats() {
    const stats = {};
    
    const totalBooksResult = await pool.query('SELECT COUNT(*)::int as total_books FROM books');
    stats.total_books = totalBooksResult.rows[0].total_books || 0;

    const totalAuthorsResult = await pool.query('SELECT COUNT(*)::int as total_authors FROM authors');
    stats.total_authors = totalAuthorsResult.rows[0].total_authors || 0;

    const totalCategoriesResult = await pool.query('SELECT COUNT(*)::int as total_categories FROM categories');
    stats.total_categories = totalCategoriesResult.rows[0].total_categories || 0;

    const borrowedLoansResult = await pool.query(`SELECT COUNT(*)::int as total_borrowed_loans FROM loans WHERE status = 'BORROWED'`);
    stats.total_borrowed_loans = borrowedLoansResult.rows[0].total_borrowed_loans || 0;

    return stats;
  }
};