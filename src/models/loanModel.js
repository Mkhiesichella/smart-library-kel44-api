import { pool } from '../config/db.js';

export const LoanModel = {
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }
      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);
      const loanQuery = `INSERT INTO loans (book_id, member_id, due_date) VALUES ($1, $2, $3) RETURNING *`;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAllLoans() {
    const query = `
      SELECT l.*, b.title as book_title, m.full_name as member_name 
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async returnLoan(loan_id, return_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const loanCheck = await client.query('SELECT * FROM loans WHERE id = $1 FOR UPDATE', [loan_id]);
      if (loanCheck.rows.length === 0) {
        throw new Error('Data peminjaman tidak ditemukan.');
      }
      if (loanCheck.rows[0].status === 'RETURNED') {
        throw new Error('Buku sudah dikembalikan.');
      }
      const book_id = loanCheck.rows[0].book_id;
      const updateLoanQuery = `UPDATE loans SET status = 'RETURNED', return_date = $1 WHERE id = $2 RETURNING *`;
      const result = await client.query(updateLoanQuery, [return_date, loan_id]);
      await client.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [book_id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getTopBorrowers() {
    const query = `
      SELECT 
        m.id AS member_id,
        m.full_name,
        m.email,
        m.member_type,
        m.joined_at,
        COUNT(l.id)::int AS total_loans,
        MAX(l.loan_date) AS last_loan_date,
        (
          SELECT json_build_object(
            'title', b.title,
            'times_borrowed', COUNT(*)::int
          )
          FROM loans l2
          JOIN books b ON l2.book_id = b.id
          WHERE l2.member_id = m.id
          GROUP BY b.title
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) AS favorite_book
      FROM members m
      JOIN loans l ON m.id = l.member_id
      GROUP BY m.id
      ORDER BY total_loans DESC
      LIMIT 3
    `;
    const result = await pool.query(query);
    return result.rows;
  }
};