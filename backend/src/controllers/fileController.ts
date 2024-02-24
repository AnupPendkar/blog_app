import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

export function uploadFile(req, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // var buffer = Buffer.from(req.file.originalname, 'base64');
    // const newFileName = 'nodejs.png';
    // fs.writeFile(`./${newFileName}`, buffer, 'utf-8').then( () => {
      //   res.status(200).sendFile(`${uploadDirectory}/${newFileName}`);
      // });
      // console.log(buffer);
      // return;
    const uploadDirectory = path.join(__dirname, '../../uploads');

    const fileName = req.file.originalname;
    const relativeURL = `http://${process.env.HOST}:${process.env.PORT}/${fileName}`;

    const filePath = path.join(uploadDirectory, req.file.originalname);

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    fs.renameSync(req.file.path, filePath);

    return res.json({ path: relativeURL });
  } catch (error) {
    next(error);
  }
}
