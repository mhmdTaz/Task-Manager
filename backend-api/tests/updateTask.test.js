const { app, request, createTestTask, clearTasks } = require('./setup');

describe('PUT /api/tasks/:id', () => {
  beforeEach(() => clearTasks());

  it('should update task title', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Task updated successfully');
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.description).toBe(task.description);
  });

  it('should update task description', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ description: 'Updated Description' });

    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe('Updated Description');
    expect(res.body.data.title).toBe(task.title);
  });

  it('should update task status to in-progress', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ status: 'in-progress' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('in-progress');
  });

  it('should update task status to completed', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('should update multiple fields at once', async () => {
    const task = await createTestTask();

    const res = await request(app).put(`/api/tasks/${task.id}`).send({
      title: 'New Title',
      description: 'New Description',
      status: 'completed',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('New Title');
    expect(res.body.data.description).toBe('New Description');
    expect(res.body.data.status).toBe('completed');
  });

  it('should update the updatedAt timestamp', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Timestamp Check' });

    expect(res.status).toBe(200);
    expect(new Date(res.body.data.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(task.updatedAt).getTime()
    );
  });

  it('should return 404 for non-existent task', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    const res = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .send({ title: 'Ghost Task' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Task not found');
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app)
      .put('/api/tasks/bad-id')
      .send({ title: 'Bad ID' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid task id/i);
  });

  it('should return 400 for invalid status value', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ status: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/status/i);
  });

  it('should return 400 when body is empty', async () => {
    const task = await createTestTask();

    const res = await request(app).put(`/api/tasks/${task.id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least one field/i);
  });

  it('should strip unknown fields', async () => {
    const task = await createTestTask();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: 'Clean', hackField: 'removed' });

    expect(res.status).toBe(200);
    expect(res.body.data.hackField).toBeUndefined();
  });
});
