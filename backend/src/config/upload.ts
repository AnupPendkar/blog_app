import { google } from 'googleapis';
import 'dotenv/config';


export const jwtClient = new google.auth.JWT(process.env.DRIVE_EMAIL, null, process.env.DRIVE_EMAIL, ['https://www.googleapis.com/auth/drive']);

jwtClient.authorize((err) => {
  if (err) {
    console.error('Error authenticating with Google Drive API:', err);
    return;
  }

  console.log('Successfully authenticated with Google Drive API');
});
