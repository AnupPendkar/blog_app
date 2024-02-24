import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { isPropEmpty } from '../utils/utils';

function appMiddleware(req: Request, res: Response, next: NextFunction) {
  if (['/api/login', '/api/register']?.includes(req.url)) {
    next();
    return;
  }

  const bearerToken = req.headers['authorization']?.split(' ')?.[1];

  if (isPropEmpty(bearerToken)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    (req as any).user = decoded;
    next();
  });
}

export default appMiddleware;
