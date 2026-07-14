// src/nodemailer-service/emailTemplates.js

export const welcomeEmailTemplate = (name) => {
    return {
        subject: 'Welcome to Swahili Pot Hub!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #c0392b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Swahili Pot Hub</h1>
                    <p style="color: white; margin: 5px 0;">Event Venue Booking</p>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Welcome, ${name}! 🎉</h2>
                    <p style="color: #555; line-height: 1.6;">Thank you for creating an account with Swahili Pot Hub. We're excited to have you on board!</p>
                    <p style="color: #555; line-height: 1.6;">You can now browse and book our amazing venues for your events.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000" style="background-color: #c0392b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Browse Venues</a>
                    </div>
                    <p style="color: #888; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
                </div>
                <div style="background-color: #333; padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px;">© 2026 Swahili Pot Hub Foundation. All rights reserved.</p>
                </div>
            </div>
        `
    };
};

export const bookingReceivedTemplate = (name, roomName, date) => {
    return {
        subject: 'Booking Received - Swahili Pot Hub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #c0392b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Swahili Pot Hub</h1>
                    <p style="color: white; margin: 5px 0;">Event Venue Booking</p>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #2980b9;">📩 Booking Received!</h2>
                    <p style="color: #555;">Dear ${name},</p>
                    <p style="color: #555; line-height: 1.6;">We have received your booking request. It is currently being reviewed and you will be notified once confirmed.</p>
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2980b9;">
                        <p><strong>Venue:</strong> ${roomName || 'N/A'}</p>
                        <p><strong>Date:</strong> ${date || 'N/A'}</p>
                        <p><strong>Status:</strong> Pending Review</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/my-bookings" style="background-color: #c0392b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Bookings</a>
                    </div>
                </div>
                <div style="background-color: #333; padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px;">© 2026 Swahili Pot Hub Foundation. All rights reserved.</p>
                </div>
            </div>
        `
    };
};

export const bookingAcceptedTemplate = (name, roomName, date) => {
    return {
        subject: 'Booking Confirmed - Swahili Pot Hub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #c0392b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Swahili Pot Hub</h1>
                    <p style="color: white; margin: 5px 0;">Event Venue Booking</p>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #27ae60;">✅ Booking Confirmed!</h2>
                    <p style="color: #555;">Dear ${name},</p>
                    <p style="color: #555; line-height: 1.6;">Great news! Your booking has been confirmed.</p>
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #27ae60;">
                        <p><strong>Venue:</strong> ${roomName || 'N/A'}</p>
                        <p><strong>Date:</strong> ${date || 'N/A'}</p>
                        <p><strong>Status:</strong> Confirmed ✅</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/my-bookings" style="background-color: #c0392b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Bookings</a>
                    </div>
                </div>
                <div style="background-color: #333; padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px;">© 2026 Swahili Pot Hub Foundation. All rights reserved.</p>
                </div>
            </div>
        `
    };
};

export const bookingRejectedTemplate = (name, roomName, date) => {
    return {
        subject: 'Booking Cancelled - Swahili Pot Hub',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #c0392b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Swahili Pot Hub</h1>
                    <p style="color: white; margin: 5px 0;">Event Venue Booking</p>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #e74c3c;">❌ Booking Cancelled</h2>
                    <p style="color: #555;">Dear ${name},</p>
                    <p style="color: #555; line-height: 1.6;">Unfortunately your booking has been cancelled. Please contact us if you have any questions.</p>
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                        <p><strong>Venue:</strong> ${roomName || 'N/A'}</p>
                        <p><strong>Date:</strong> ${date || 'N/A'}</p>
                        <p><strong>Status:</strong> Cancelled ❌</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000" style="background-color: #c0392b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book Another Venue</a>
                    </div>
                </div>
                <div style="background-color: #333; padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px;">© 2026 Swahili Pot Hub Foundation. All rights reserved.</p>
                </div>
            </div>
        `
    };
};