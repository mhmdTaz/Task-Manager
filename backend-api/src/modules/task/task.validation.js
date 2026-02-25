const Joi = require('joi');
const { TASK_STATUSES } = require('../../shared/constants');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(2000).required().messages({
    'string.empty': 'Description is required',
    'string.max': 'Description cannot exceed 2000 characters',
    'any.required': 'Description is required',
  }),
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed',
    }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(200).messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  description: Joi.string().trim().max(2000).messages({
    'string.empty': 'Description cannot be empty',
    'string.max': 'Description cannot exceed 2000 characters',
  }),
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .messages({
      'any.only': 'Status must be one of: pending, in-progress, completed',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

// Accept both MongoDB ObjectId (24 hex chars) and UUID formats
const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^([0-9a-fA-F]{24}|[0-9a-fA-F-]{36})$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required',
    }),
});

module.exports = { createTaskSchema, updateTaskSchema, taskIdParamSchema };
