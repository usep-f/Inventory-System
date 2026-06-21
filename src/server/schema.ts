import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

// ==========================================
// 1. Database Schema Definitions (Drizzle)
// ==========================================

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  barcode: text('barcode').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(0),
  price: real('price'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull().default(''),
  productBarcode: text('product_barcode').notNull().default(''),
  changeType: text('change_type', { enum: ['ADD', 'SUBTRACT', 'CREATE', 'DELETE'] }).notNull(),
  quantity: integer('quantity').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pin: text('pin').notNull().default('1234'),
  port: integer('port').notNull().default(3000),
});

// ==========================================
// 2. Input Validation Schemas (Zod)
// ==========================================

// Regular expression to check for typical barcode character sets (alphanumeric and standard symbols)
const barcodeRegex = /^[a-zA-Z0-9\-_./]+$/;

export const barcodeSchema = z.string()
  .trim()
  .min(1, { message: 'Barcode cannot be empty' })
  .max(50, { message: 'Barcode is too long (max 50 characters)' })
  .regex(barcodeRegex, { message: 'Barcode contains invalid characters' });

export const pinSchema = z.string()
  .trim()
  .length(4, { message: 'PIN must be exactly 4 digits' })
  .regex(/^\d+$/, { message: 'PIN must contain only numbers' });

export const productInputSchema = z.object({
  barcode: barcodeSchema,
  name: z.string()
    .trim()
    .min(1, { message: 'Product name cannot be empty' })
    .max(100, { message: 'Product name is too long (max 100 characters)' }),
  description: z.string()
    .trim()
    .max(300, { message: 'Description is too long (max 300 characters)' })
    .optional()
    .nullable(),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number()
      .min(0, { message: 'Price cannot be negative' })
      .max(1000000, { message: 'Price is too high' })
      .nullable()
      .optional()
  ),
  quantity: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? 0 : Number(val)),
    z.number()
      .int({ message: 'Quantity must be an integer' })
      .min(0, { message: 'Quantity cannot be negative' })
      .max(100000, { message: 'Quantity is too high' })
  )
});

export const scanActionSchema = z.object({
  barcode: barcodeSchema,
  action: z.enum(['ADD', 'SUBTRACT'], {
    errorMap: () => ({ message: 'Action must be either ADD or SUBTRACT' })
  }),
  pin: pinSchema,
});

export const loginSchema = z.object({
  pin: pinSchema,
  role: z.enum(['pc', 'mobile'], {
    errorMap: () => ({ message: 'Role must be pc or mobile' })
  })
});

// Infer TypeScript types from Drizzle schema and Zod schemas
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

export type ProductInput = z.infer<typeof productInputSchema>;
export type ScanActionInput = z.infer<typeof scanActionSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
