const request = require('supertest');
const app = require('../src/app');
const taskRepository = require('../src/modules/task/task.repository');

const createTestTask = async (overrides = {}) => {
  const taskData = {
    title: 'Test Task',
    description: 'Test Description',
    ...overrides,
  };

  const res = await request(app).post('/api/tasks').send(taskData);
  return res.body.data;
};

const clearTasks = () => {
  taskRepository.clear();
};

module.exports = { app, request, createTestTask, clearTasks };
