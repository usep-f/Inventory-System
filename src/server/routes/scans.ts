import { Router, Request, Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { products, logs, scanActionSchema } from '../schema';
import { z } from 'zod';

const router = Router();

router.get('/logs', (_req: Request, res: Response) => {
  try {
    const allLogs = db.select({
      id: logs.id,
      productId: logs.productId,
      productName: products.name,
      changeType: logs.changeType,
      quantity: logs.quantity,
      timestamp: logs.timestamp,
    })
    .from(logs)
    .innerJoin(products, eq(logs.productId, products.id))
    .orderBy(desc(logs.timestamp))
    .limit(100)
    .all();

    res.json(allLogs);
  } catch (error) {
    console.error('Fetch logs error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const data = scanActionSchema.parse(req.body);
    const now = new Date();

    const product = db.select().from(products).where(eq(products.barcode, data.barcode)).limit(1).get();
    
    if (!product) {
      res.status(404).json({ error: 'NOT_FOUND', barcode: data.barcode, message: 'Product not found. JIT registration required.' });
      return;
    }

    const newQuantity = data.action === 'ADD' 
      ? product.quantity + 1
      : Math.max(0, product.quantity - 1);

    const incrementAmount = data.action === 'ADD' ? 1 : 1;

    // Transaction for safety
    const result = db.transaction((tx) => {
      const updatedProduct = tx.update(products)
        .set({ quantity: newQuantity, updatedAt: now })
        .where(eq(products.id, product.id))
        .returning()
        .get();

      tx.insert(logs).values({
        productId: product.id,
        changeType: data.action,
        quantity: incrementAmount,
        timestamp: now,
      }).run();

      return updatedProduct;
    });

    res.json({ success: true, product: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', issues: error.issues });
      return;
    }
    console.error('Scan error:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

export default router;
