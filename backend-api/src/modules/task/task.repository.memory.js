const crypto = require('crypto');
const { TASK_STATUS } = require('../../shared/constants');

class MemoryTaskRepository {
  constructor() {
    this._tasks = new Map();
  }

  async findAll(filter = {}) {
    let tasks = Array.from(this._tasks.values());

    for (const [key, value] of Object.entries(filter)) {
      tasks = tasks.filter((t) => t[key] === value);
    }

    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return tasks.map((t) => ({ ...t }));
  }

  async findById(id) {
    const task = this._tasks.get(id);
    return task ? { ...task } : null;
  }

  async create(data, _session = null) {
    const id = crypto.randomUUID();
    const task = {
      id,
      _id: id,
      title: data.title,
      description: data.description,
      status: data.status || TASK_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._tasks.set(id, task);
    return { ...task };
  }

  async updateById(id, data, _session = null) {
    const task = this._tasks.get(id);
    if (!task) return null;

    const updated = {
      ...task,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this._tasks.set(id, updated);
    return { ...updated };
  }

  async deleteById(id, _session = null) {
    const task = this._tasks.get(id);
    if (!task) return null;
    this._tasks.delete(id);
    return { ...task };
  }

  clear() {
    this._tasks.clear();
  }
}

module.exports = new MemoryTaskRepository();
