const app = require('./src/app');
const config = require('./src/config');

const startServer = async () => {
  if (config.storageType === 'mongodb') {
    const connectDB = require('./src/config/database');
    await connectDB();
  } else {
    console.log('Using in-memory storage');
  }

  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
