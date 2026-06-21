import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { settings, loginSchema } from '../schema';
import { validatePin } from '../middleware';
import { z } from 'zod';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const currentSettings = db.select().from(settings).limit(1).get();

    if (!currentSettings || data.pin !== currentSettings.pin) {
       res.status(401).json({ error: 'UNAUTHORIZED', message: 'Incorrect PIN' });
       return;
    }

    res.json({ success: true, role: data.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ error: 'VALIDATION_ERROR', issues: error.issues });
       return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

const settingsUpdateSchema = z.object({
  pin: z.string().length(4).regex(/^\d+$/).optional(),
  port: z.number().int().min(1024).max(65535).optional(),
});

router.get('/settings', validatePin, (_req: Request, res: Response) => {
  try {
    const currentSettings = db.select().from(settings).limit(1).get();
    if (!currentSettings) {
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Settings not found' });
      return;
    }
    res.json(currentSettings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.post('/settings', validatePin, (req: Request, res: Response) => {
  try {
    const data = settingsUpdateSchema.parse(req.body);
    const currentSettings = db.select().from(settings).limit(1).get();

    if (!currentSettings) {
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Settings not found' });
      return;
    }

    const updated = db.update(settings)
      .set({
        pin: data.pin ?? currentSettings.pin,
        port: data.port ?? currentSettings.port
      })
      .where(eq(settings.id, currentSettings.id))
      .returning()
      .get();

    res.json({ success: true, settings: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ error: 'VALIDATION_ERROR', issues: error.issues });
       return;
    }
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
