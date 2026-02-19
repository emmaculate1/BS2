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
                    <p style="color: #555; line-height: 1.6;">
                        Thank you for creating an account with Swahili Pot Hub. 
                        We're excited to have you on board!
                    </p>
                    <p style="color: #555; line-height: 1.6;">
                        You can now browse and book our amazing venues for your events.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000" 
                           style="background-color: #c0392b; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Browse Venues
                        </a>
                    </div>
                    <p style="color: #888; font-size: 12px;">
                        If you didn't create this account, please ignore this email.
                    </p>
                </div>
                <div style="background-color: #333; padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px;">
                        © 2026 Swahili Pot Hub. All rights reserved.
                    </p>
                </div>
            </div>
        `
    };
};