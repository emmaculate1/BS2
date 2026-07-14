import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import { sendEmail } from '../nodemailer-service/emailService.js';
import { welcomeEmailTemplate } from '../nodemailer-service/emailTemplates.js';

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create({ name, email, password: hashedPassword });

        const { subject, html } = welcomeEmailTemplate(name);
        await sendEmail({ to: email, subject, html });

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        res.status(201).json({ success: true, message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ success: false, message: 'No account found with that email' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

        await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [resetToken, resetTokenExpires, user.id]);

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="background:#c0392b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
                <p>This link expires in 30 minutes.</p>
            `
        });

        res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ success: false, message: 'Error sending reset email', error: error.message });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);

        if (rows.length === 0) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

        const user = rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashedPassword, user.id]);

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
    }
};

// Send message to user (admin only)
export const sendMessage = async (req, res) => {
    try {
        const { to, name, message } = req.body;
        await sendEmail({
            to,
            subject: 'Message from Swahili Pot Hub Admin',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                    <div style="background:#c0392b;padding:20px;text-align:center;">
                        <h1 style="color:white;margin:0;">Swahili Pot Hub</h1>
                        <p style="color:white;margin:5px 0;">Event Venue Booking</p>
                    </div>
                    <div style="padding:30px;background:#f9f9f9;">
                        <p>Dear <strong>${name}</strong>,</p>
                        <p style="line-height:1.6;">${message}</p>
                        <p style="color:#888;font-size:12px;margin-top:20px;">You can reply directly to this email.</p>
                    </div>
                    <div style="background:#333;padding:15px;text-align:center;">
                        <p style="color:#888;margin:0;font-size:12px;">© 2026 Swahili Pot Hub Foundation. All rights reserved.</p>
                    </div>
                </div>
            `
        });
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
};