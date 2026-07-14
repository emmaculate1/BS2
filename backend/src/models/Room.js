import pool from '../config/database.js';

class Room {
    // Get all rooms
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM rooms ORDER BY created_at DESC');
        return rows;
    }

    // Get room by ID
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
        return rows[0];
    }

    // Create new room
    static async create(roomData) {
        const { name, type, capacity, price, description, amenities, image_url, status = 'available' } = roomData;
        const [result] = await pool.query(
            'INSERT INTO rooms (name, type, capacity, price, description, amenities, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, type, capacity, price, description, JSON.stringify(amenities), image_url, status]
        );
        return result.insertId;
    }

    // Update room
    static async update(id, roomData) {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(roomData)) {
            fields.push(`${key} = ?`);
            values.push(key === 'amenities' ? JSON.stringify(value) : value);
        }

        values.push(id);
        const [result] = await pool.query(
            `UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    // Delete room
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
        return result.affectedRows;
    }

    // Get available rooms
    static async findAvailable() {
        const [rows] = await pool.query('SELECT * FROM rooms WHERE LOWER(status) = "available" ORDER BY created_at DESC');
        return rows;
    }
}

export default Room;
