import { Router, Request, Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { products, productInputSchema } from '../schema';
import { z } from 'zod';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const allProducts = db.select().from(products).orderBy(desc(products.createdAt)).all();
    res.json(allProducts);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const data = productInputSchema.parse(req.body);
    const now = new Date();
    
    // Check for existing barcode
    const existing = db.select().from(products).where(eq(products.barcode, data.barcode)).limit(1).get();
    if (existing) {
      res.status(409).json({ error: 'CONFLICT', message: 'Product with this barcode already exists' });
      return;
    }

    const newProduct = db.insert(products).values({
      barcode: data.barcode,
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      createdAt: now,
      updatedAt: now,
    }).returning().get();

    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', issues: error.issues });
      return;
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid ID' });
      return;
    }

    const data = productInputSchema.partial().parse(req.body);
    const now = new Date();

    const existing = db.select().from(products).where(eq(products.id, id)).limit(1).get();
    if (!existing) {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
      return;
    }

    const updated = db.update(products).set({
      barcode: data.barcode ?? existing.barcode,
      name: data.name ?? existing.name,
      description: data.description !== undefined ? data.description : existing.description,
      price: data.price !== undefined ? data.price : existing.price,
      quantity: data.quantity ?? existing.quantity,
      updatedAt: now,
    }).where(eq(products.id, id)).returning().get();

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', issues: error.issues });
      return;
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid ID' });
      return;
    }

    db.delete(products).where(eq(products.id, id)).run();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
