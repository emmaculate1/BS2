import pool from '../config/database.js';

class User {
    // Get all users
    static async findAll() {
        const [rows] = await pool.query('SELECT id, full_name, email, role, created_at FROM users');
        return rows;
    }

    // Get user by ID
    static async findById(id) {
        const [rows] = await pool.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    // Get user by email
    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // Create new user
    static async create(userData) {
        const { name, email, password, role = 'user' } = userData;
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }

    // Update user
    static async update(id, userData) {
        // Map frontend field names to DB column names if needed
        const columnMap = {
            name: 'full_name',
            password: 'password_hash'
        };
        const fields = Object.keys(userData)
            .map(key => `${columnMap[key] || key} = ?`)
            .join(', ');
        const values = [...Object.values(userData), id];
        const [result] = await pool.query(
            `UPDATE users SET ${fields} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    // Delete user
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

export default User;

