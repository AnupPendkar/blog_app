import { google } from 'googleapis';
import 'dotenv/config';


// export const jwtClient = new google.auth.JWT(process.env.DRIVE_EMAIL, null, process.env.DRIVE_KEY, ['https://www.googleapis.com/auth/drive'], null, process.env.KEY_ID);
export const jwtClient = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.DRIVE_EMAIL,
    private_key: process.env.DRIVE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// jwtClient.authorize((err) => {
//   if (err) {
//     console.error('Error authenticating with Google Drive API:', err);
//     return;
//   }

//   console.log('Successfully authenticated with Google Drive API');
// });
