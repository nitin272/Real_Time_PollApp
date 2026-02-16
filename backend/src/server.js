import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { config } from './config/environment.js';
import { connectDatabase } from './infrastructure/database/connection.js';
import { pollRouter } from './http/routes/pollRoutes.js';
import { setupSocketHandlers } from './http/socket/socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { 
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(express.static(join(__dirname, '../../Client/dist')));

app.use('/api', pollRouter);

setupSocketHandlers(io);

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../../Client/dist/index.html'));
});

async function startServer() {
  try {
    await connectDatabase(config.mongodbUri);
    
    httpServer.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Real-Time Poll Server Running        ║
║   Port: ${config.port}                        ║
║   Environment: ${config.nodeEnv.padEnd(19)} ║
║   Database: Connected                  ║
║   CORS: ${config.corsOrigin.padEnd(27)} ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
