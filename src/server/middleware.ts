import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { settings } from './schema';

export const validatePin = (req: Request, res: Response, next: NextFunction): void => {
  const pinHeader = req.header('X-Access-PIN');
  
  try {
    const currentSettings = db.select().from(settings).limit(1).get();
    
    if (!currentSettings || pinHeader !== currentSettings.pin) {
      res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or missing PIN' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error in validatePin middleware:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};
