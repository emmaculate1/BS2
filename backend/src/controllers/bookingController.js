import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import { sendEmail } from '../nodemailer-service/emailService.js';
import {
    bookingReceivedTemplate,
    bookingAcceptedTemplate,
    bookingRejectedTemplate
} from '../nodemailer-service/emailTemplates.js';

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
};

// Get single booking
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
    }
};

// Create booking
export const createBooking = async (req, res) => {
    try {
        const bookingId = await Booking.create(req.body);
        const booking = await Booking.findById(bookingId);

        // Update room status to Reserved
        await Room.update(booking.room_id, { status: 'Reserved' });

        // Send email notification
        try {
            const user = await User.findById(booking.user_id);
            const room = await Room.findById(booking.room_id);
            if (user && room) {
                const emailData = bookingReceivedTemplate(
                    user.full_name,
                    room.name,
                    new Date(booking.booking_date).toLocaleDateString()
                );
                await sendEmail({ to: user.email, subject: emailData.subject, html: emailData.html });
            }
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
        }

        res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
    }
};

// Update booking
export const updateBooking = async (req, res) => {
    try {
        const oldBooking = await Booking.findById(req.params.id);
        const affectedRows = await Booking.update(req.params.id, req.body);

        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Booking not found' });

        const booking = await Booking.findById(req.params.id);

        // Update room status if booking status changed
        if (req.body.status && oldBooking.status !== req.body.status) {
            let roomStatus = null;
            if (req.body.status === 'confirmed') {
                roomStatus = 'Booked';
            } else if (['cancelled', 'rejected', 'pending'].includes(req.body.status)) {
                // If it becomes pending again, it should probably be 'Reserved'
                // But for now let's follow the standard: confirmed=Booked, others=Available if cancelled/rejected
                roomStatus = (req.body.status === 'pending') ? 'Reserved' : 'Available';
            }

            if (roomStatus) {
                await Room.update(booking.room_id, { status: roomStatus });
            }

            // Send email
            try {
                const user = await User.findById(booking.user_id);
                const room = await Room.findById(booking.room_id);
                if (user && room) {
                    let emailData;
                    if (req.body.status === 'confirmed') {
                        emailData = bookingAcceptedTemplate(user.full_name, room.name, new Date(booking.booking_date).toLocaleDateString());
                    } else if (req.body.status === 'cancelled' || req.body.status === 'rejected') {
                        emailData = bookingRejectedTemplate(user.full_name, room.name, new Date(booking.booking_date).toLocaleDateString());
                    }
                    if (emailData) {
                        await sendEmail({ to: user.email, subject: emailData.subject, html: emailData.html });
                    }
                }
            } catch (emailError) {
                console.error('Status email failed:', emailError);
            }
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully', data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
    }
};

// Delete booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        const affectedRows = await Booking.delete(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Update room status back to Available
        await Room.update(booking.room_id, { status: 'Available' });

        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting booking', error: error.message });
    }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByUserId(req.params.userId);
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user bookings', error: error.message });
    }
};

