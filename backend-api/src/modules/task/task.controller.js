const taskService = require('./task.service');
const { sendSuccess } = require('../../shared/utils/responseHandler');
const asyncHandler = require('../../middleware/asyncHandler');

const getAllTasks = asyncHandler(async (_req, res) => {
  const tasks = await taskService.getAllTasks();
  sendSuccess(res, 200, tasks, 'Tasks retrieved successfully');
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  sendSuccess(res, 200, task, 'Task retrieved successfully');
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body);
  sendSuccess(res, 201, task, 'Task created successfully');
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  sendSuccess(res, 200, task, 'Task updated successfully');
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  sendSuccess(res, 200, null, 'Task deleted successfully');
});

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
