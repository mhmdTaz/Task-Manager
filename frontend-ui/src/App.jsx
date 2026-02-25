import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/taskService';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(fields) {
    try {
      const task = await createTask(fields);
      setTasks((prev) => [task, ...prev]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, fields) {
    try {
      const updated = await updateTask(id, fields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingTaskId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateTask(id, { status });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      <TaskForm onSubmit={handleCreate} />

      {loading && <p className="empty-state">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p className="empty-state">No tasks yet. Create one above!</p>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            onEdit={setEditingTaskId}
            onCancelEdit={() => setEditingTaskId(null)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
