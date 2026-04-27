import { pool } from '../config/db.js';

export const AuthorModel = {
  async getAll(searchName = '') {
    let query = 'SELECT * FROM authors ';
    let params = [];
    if (searchName) {
      query += 'WHERE name ILIKE $1 ';
      params.push(`%${searchName}%`);
    }
    query += 'ORDER BY name ASC';
    const result = await pool.query(query, params);
    return result.rows;
  },
  async getById(id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return result.rows[0];
  },
  async create(name, nationality) {
    const query = 'INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },
  async update(id, name, nationality) {
    const query = 'UPDATE authors SET name = $1, nationality = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [name, nationality, id]);
    return result.rows[0];
  },
  async delete(id) {
    const query = 'DELETE FROM authors WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};