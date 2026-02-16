import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { config } from './config/environment.js';
import { connectDatabase } from './infrastructure/database/connection.js';
import { pollRouter } from './http/routes/pollRoutes.js';
import { setupSocketHandlers } from './http/socket/socketHandlers.js';

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

app.use('/api', pollRouter);

setupSocketHandlers(io);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
