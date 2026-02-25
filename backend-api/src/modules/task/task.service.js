const mongoose = require('mongoose');
const config = require('../../config');
const taskRepository = require('./task.repository');
const AppError = require('../../shared/errors/AppError');

const useMongo = config.storageType === 'mongodb';

const withTransaction = async (fn) => {
  if (!useMongo) return fn(null);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

class TaskService {
  async getAllTasks() {
    return taskRepository.findAll();
  }

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async createTask(data) {
    return withTransaction((session) => taskRepository.create(data, session));
  }

  async updateTask(id, data) {
    return withTransaction(async (session) => {
      const task = await taskRepository.updateById(id, data, session);
      if (!task) {
        throw new AppError('Task not found', 404);
      }
      return task;
    });
  }

  async deleteTask(id) {
    return withTransaction(async (session) => {
      const task = await taskRepository.deleteById(id, session);
      if (!task) {
        throw new AppError('Task not found', 404);
      }
      return task;
    });
  }
}

module.exports = new TaskService();
