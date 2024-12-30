// scripts/exchangeCode.js
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

async function getTokens(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Access Token:', tokens.access_token);
  } catch (error) {
    console.error('Error getting tokens:', error);
  }
}

// Using the code from your URL
getTokens('4/0AanRRrtfguzrNh_kG0G85ndWsM1ALKFzVLcmn88q18CZ7Bkr0kK4u_MQL1MkqdOVEOd0vw');
