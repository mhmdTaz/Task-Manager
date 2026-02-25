const { app, request, createTestTask, clearTasks } = require('./setup');

describe('DELETE /api/tasks/:id', () => {
  beforeEach(() => clearTasks());

  it('should delete an existing task', async () => {
    const task = await createTestTask();

    const res = await request(app).delete(`/api/tasks/${task.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Task deleted successfully');
    expect(res.body.data).toBeNull();
  });

  it('should remove the task from the list after deletion', async () => {
    const task = await createTestTask();

    await request(app).delete(`/api/tasks/${task.id}`);

    const listRes = await request(app).get('/api/tasks');
    expect(listRes.body.data).toHaveLength(0);
  });

  it('should return 404 when deleting a non-existent task', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    const res = await request(app).delete(`/api/tasks/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Task not found');
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).delete('/api/tasks/bad-id');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid task id/i);
  });

  it('should not affect other tasks when deleting one', async () => {
    const task1 = await createTestTask({ title: 'Keep Me', description: 'Stay' });
    const task2 = await createTestTask({ title: 'Delete Me', description: 'Gone' });

    await request(app).delete(`/api/tasks/${task2.id}`);

    const listRes = await request(app).get('/api/tasks');
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].title).toBe('Keep Me');
  });

  it('should return 404 when deleting the same task twice', async () => {
    const task = await createTestTask();

    await request(app).delete(`/api/tasks/${task.id}`);
    const res = await request(app).delete(`/api/tasks/${task.id}`);

    expect(res.status).toBe(404);
  });
});
