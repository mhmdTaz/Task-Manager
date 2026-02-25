const { Router } = require('express');
const taskController = require('./task.controller');
const validateRequest = require('../../middleware/validateRequest');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} = require('./task.validation');

const router = Router();

router.get('/', taskController.getAllTasks);

router.get(
  '/:id',
  validateRequest(taskIdParamSchema, 'params'),
  taskController.getTaskById
);

router.post(
  '/',
  validateRequest(createTaskSchema, 'body'),
  taskController.createTask
);

router.put(
  '/:id',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(updateTaskSchema, 'body'),
  taskController.updateTask
);

router.delete(
  '/:id',
  validateRequest(taskIdParamSchema, 'params'),
  taskController.deleteTask
);

module.exports = router;
