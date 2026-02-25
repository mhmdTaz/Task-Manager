import { useState } from 'react';

export default function TaskForm({ onSubmit, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = initialData !== null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      if (!isEdit) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        required
      />
      <div className="task-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save' : 'Add Task'}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
