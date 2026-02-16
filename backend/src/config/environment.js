import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:4500', 'https://real-time-poll-app-mu.vercel.app'];

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: allowedOrigins,
  voteCooldownMs: parseInt(process.env.VOTE_COOLDOWN_MS) || 5000,
};

if (!config.mongodbUri) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}
