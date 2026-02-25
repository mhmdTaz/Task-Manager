const API_BASE = 'http://localhost:5000/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json.data;
}

export function getTasks() {
  return request(API_BASE);
}

export function createTask({ title, description }) {
  return request(API_BASE, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
}

export function updateTask(id, fields) {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
}

export function deleteTask(id) {
  return request(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
}
