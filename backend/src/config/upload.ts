import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const credentials = require('./driveCredentials.json');

export const jwtClient = new google.auth.JWT(credentials.client_email, null, credentials.private_key, ['https://www.googleapis.com/auth/drive']);

jwtClient.authorize((err) => {
  if (err) {
    console.error('Error authenticating with Google Drive API:', err);
    return;
  }

  console.log('Successfully authenticated with Google Drive API');
});

// async function authorize() {
//   // Authenticate with Google Drive API
//   await jwtClient.authorize();
//   return jwtClient;
// }

// async function uploadFile(authClient) {
//   return new Promise((resolve, reject) => {
//     const drive = google.drive({ version: 'v3', auth: authClient });

//     var fileMetaData = {
//       name: '',
//       parents: ['1En7zppXxhRUbj2d3JP0MaxGe8UOsCh6E'],
//     };

//     drive.files.create(
//       {
//         requestBody: fileMetaData,
//         media: {
//           body: fs.createReadStream(path.resolve(__dirname, './text.txt')),
//           mimeType: 'text/plain',
//         },
//         fields: 'id',
//       },
//       function (err, file) {
//         if (err) {
//           return reject(err);
//         }

//         resolve(file);
//       }
//     );
//   });
// }

// export function call() {
//   authorize().then(uploadFile).catch();
// }
