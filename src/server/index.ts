import express from 'express';
import cors from 'cors';
import path from 'path';
import { networkInterfaces } from 'os';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function to get local IP address
export function getLocalIpAddress(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    for (const net of interfaces) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Serve static React files in production
const clientDistPath = path.join(__dirname, '../client');
app.use(express.static(clientDistPath));

// Placeholder API routes
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

app.listen(PORT, () => {
  const localIp = getLocalIpAddress();
  console.info(`Server running locally at http://localhost:${PORT}`);
  console.info(`Network access available at http://${localIp}:${PORT}`);
});
