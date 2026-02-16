import dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CORS_ORIGIN]
  : ['http://localhost:4500', 'http://real-time-poll-app-lake.vercel.app'];

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
