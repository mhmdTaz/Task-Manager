const { app, request, createTestTask, clearTasks } = require('./setup');

describe('GET /api/tasks', () => {
  beforeEach(() => clearTasks());

  it('should return empty array when no tasks exist', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Tasks retrieved successfully');
    expect(res.body.data).toEqual([]);
  });

  it('should return all tasks', async () => {
    await createTestTask({ title: 'Task 1', description: 'First task' });
    await createTestTask({ title: 'Task 2', description: 'Second task' });

    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('should return tasks sorted by createdAt descending', async () => {
    await createTestTask({ title: 'Older Task', description: 'Created first' });
    await createTestTask({ title: 'Newer Task', description: 'Created second' });

    const res = await request(app).get('/api/tasks');

    expect(res.body.data[0].title).toBe('Newer Task');
    expect(res.body.data[1].title).toBe('Older Task');
  });
});

describe('GET /api/tasks/:id', () => {
  beforeEach(() => clearTasks());

  it('should return a single task by ID', async () => {
    const task = await createTestTask({ title: 'Find Me', description: 'By ID' });

    const res = await request(app).get(`/api/tasks/${task.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Find Me');
    expect(res.body.data.id).toBe(task.id);
  });

  it('should return 404 for non-existent task ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/tasks/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Task not found');
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/tasks/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid task id/i);
  });
});
