const Task = require('./task.model');

class TaskRepository {
  async findAll(filter = {}) {
    return Task.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return Task.findById(id);
  }

  async create(data, session = null) {
    const [task] = await Task.create([data], { session });
    return task;
  }

  async updateById(id, data, session = null) {
    return Task.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true, runValidators: true, session }
    );
  }

  async deleteById(id, session = null) {
    return Task.findOneAndDelete({ _id: id }, { session });
  }
}

module.exports = new TaskRepository();
