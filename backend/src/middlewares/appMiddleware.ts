import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { isPropEmpty } from '../utils/utils';

function appMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.headers['authorization']?.split(' ')?.[1];

  if (isPropEmpty(bearerToken)) {
    next();
    return;
  }

  jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err && ['/api/user-info', '/api/get-posts']?.includes(req.path)) {
      console.log('-------------', req.path, '-----------------');
      return res.status(401).json({ message: 'Token verification failed' });
    }

    (req as any).user = decoded;
    next();
  });
}

export default appMiddleware;
