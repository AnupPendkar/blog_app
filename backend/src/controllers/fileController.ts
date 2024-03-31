import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
// import { jwtClient } from '../config/upload';
// const { google } = require('googleapis');
const cloudinary = require('cloudinary').v2;

export function uploadFile(req, res: Response, next: NextFunction) {
  cloudinary.uploader
    .upload(req.file.path, {
      resource_type: 'image',
    })
    .then((result) => {
      res.status(200).send(result?.url);
    });
}

// export function uploadFile(req, res: Response, next: NextFunction) {
//   const jwtClient = new google.auth.GoogleAuth({
//     credentials: {
//       client_email: process.env.DRIVE_EMAIL,
//       private_key: process.env.DRIVE_KEY,
//     },
//     scopes: ['https://www.googleapis.com/auth/drive.file'],
//   });

//   const drive = google.drive({ version: 'v3', auth: jwtClient });

//   const fileMetadata = {
//     name: req.file.originalname,
//     parents: ['1En7zppXxhRUbj2d3JP0MaxGe8UOsCh6E'],
//     // mimeType: req.file.mimetype,
//   };

//   const media = {
//     mimeType: 'image/jpeg',
//     body: fs.createReadStream(req.file.path),
//   };

//   drive.files.create(
//     {
//       requestBody: fileMetadata,
//       media: media,
//       fields: 'id',
//     },
//     (err, file) => {
//       if (err) {
//         console.error('Error uploading image:', err);
//         res.status(500).send('Error uploading image to Google Drive');
//         return;
//       }

//       const imageUrl = file.data.webViewLink;
//       res.status(200).json({ imageUrl: imageUrl, imgId: file.data?.id });
//     }
//   );
// }

// export function uploadFile(req, res: Response, next: NextFunction) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const fileName = req.file.originalname;
//     const relativeURL = `http://localhost:${process.env.PORT}/${fileName}`;

//     const uploadDirectory = path.join(__dirname, '../../uploads');
//     const filePath = path.join(uploadDirectory, req.file.originalname);

//     if (!fs.existsSync(uploadDirectory)) {
//       fs.mkdirSync(uploadDirectory, { recursive: true });
//     }

//     fs.renameSync(req.file.path, filePath);

//     return res.json({ path: relativeURL });
//   } catch (error) {
//     next(error);
//   }
// }
