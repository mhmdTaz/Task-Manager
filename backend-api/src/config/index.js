const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  storageType: process.env.STORAGE_TYPE || 'memory',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});

module.exports = config;
