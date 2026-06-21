import express from 'express';
import cors from 'cors';
import path from 'path';
import { networkInterfaces } from 'os';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './db';
import { settings } from './schema';
import { validatePin } from './middleware';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import scansRoutes from './routes/scans';

const app = express();

app.use(cors());
app.use(express.json());

// Helper function to get local IP address
export function getLocalIpAddress(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    for (const net of interfaces) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}



// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', validatePin, productsRoutes);
app.use('/api/scans', validatePin, scansRoutes);

// Serve static React files in production
const clientDistPath = path.join(__dirname, '../client');
app.use(express.static(clientDistPath));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ip: getLocalIpAddress() });
});

// Fallback for SPA Routing (React Router / single-page setup)
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Web app assets not built yet. Run npm run build.');
    }
  });
});

async function bootstrap() {
  try {
    // 1. Run migrations programmatically
    console.info('Running database migrations...');
    migrate(db, { migrationsFolder: path.join(__dirname, '../../drizzle') });
    console.info('Migrations complete.');

    // 2. Seed settings if empty
    let currentSettings = db.select().from(settings).limit(1).get();
    if (!currentSettings) {
      console.info('Seeding default settings...');
      currentSettings = db.insert(settings).values({ pin: '1234', port: 3000 }).returning().get();
    }

    // 3. Start server
    const PORT = currentSettings.port;
    app.listen(PORT, () => {
      const localIp = getLocalIpAddress();
      console.info(`Server running locally at http://localhost:${PORT}`);
      console.info(`Network access available at http://${localIp}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
