const TASK_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
});

const TASK_STATUSES = Object.values(TASK_STATUS);

module.exports = { TASK_STATUS, TASK_STATUSES };
