const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');

const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./shared/errors/AppError');
const taskRouter = require('./modules/task/task.router');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/tasks', taskRouter);

// 404 handler
app.all('*', (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
