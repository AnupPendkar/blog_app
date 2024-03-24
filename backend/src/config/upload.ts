const createReadStream = require('fs').createReadStream;
import path from 'path';
import { google } from 'googleapis';
import 'dotenv/config';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
  const jwtClient = new google.auth.JWT(process.env.DRIVE_KEY, null, process.env.DRIVE_EMAIL, SCOPES);
  await jwtClient.authorize();
  return jwtClient;
}

/**
 * Create a new file on google drive.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function uploadFile(authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  const file = await drive.files.create({
    media: {
      body: createReadStream('filename'),
    },
    fields: 'id',
    requestBody: {
      name: path.basename('filename'),
    },
  });
  console.log(file.data.id);
}
