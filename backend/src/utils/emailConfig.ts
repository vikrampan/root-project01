// src/utils/emailConfig.ts
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const createTransporter = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'http://localhost:3000/oauth2callback'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken?.token || ''
      }
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
};

let transporter: any = null;

export const verifyEmailConfig = async () => {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }
    await transporter.verify();
    console.log('Email server is ready to send emails');
    return true;
  } catch (error) {
    console.error('Email verification error:', error);
    return false;
  }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }

    const info = await transporter.sendMail({
      from: `"RAST" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Try recreating transporter on error
    try {
      transporter = await createTransporter();
      const retryInfo = await transporter.sendMail({
        from: `"RAST" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
      console.log('Email sent successfully after retry:', retryInfo.messageId);
      return true;
    } catch (retryError) {
      console.error('Failed to send email after retry:', retryError);
      return false;
    }
  }
};