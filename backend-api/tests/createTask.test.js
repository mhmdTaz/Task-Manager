const { app, request, clearTasks } = require('./setup');

describe('POST /api/tasks', () => {
  beforeEach(() => clearTasks());

  it('should create a task with valid data', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Task description here',
    };

    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Task created successfully');
    expect(res.body.data).toMatchObject({
      title: 'New Task',
      description: 'Task description here',
      status: 'pending',
    });
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
    expect(res.body.data.updatedAt).toBeDefined();
  });

  it('should create a task with a custom status', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Urgent Task',
      description: 'Needs to be done',
      status: 'in-progress',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('in-progress');
  });

  it('should return 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      description: 'No title provided',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title/i);
  });

  it('should return 400 when description is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'No description',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/description/i);
  });

  it('should return 400 when body is empty', async () => {
    const res = await request(app).post('/api/tasks').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid status value', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Bad Status',
      description: 'Invalid status value',
      status: 'invalid-status',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/status/i);
  });

  it('should return 400 when title exceeds 200 characters', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'x'.repeat(201),
      description: 'Valid description',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/200/);
  });

  it('should return 400 when description exceeds 2000 characters', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Valid title',
      description: 'x'.repeat(2001),
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/2000/);
  });

  it('should strip unknown fields from the body', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Clean Task',
      description: 'Only known fields',
      hackField: 'should be removed',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.hackField).toBeUndefined();
  });

  it('should trim whitespace from title and description', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: '  Trimmed Title  ',
      description: '  Trimmed Description  ',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Trimmed Title');
    expect(res.body.data.description).toBe('Trimmed Description');
  });
});
