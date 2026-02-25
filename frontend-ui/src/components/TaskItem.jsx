import TaskForm from './TaskForm';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskItem({
  task,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onStatusChange,
}) {
  if (isEditing) {
    return (
      <div className={`task-item task-item--${task.status}`}>
        <TaskForm
          initialData={{ title: task.title, description: task.description }}
          onSubmit={(fields) => onUpdate(task.id, fields)}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  }

  return (
    <div className={`task-item task-item--${task.status}`}>
      <div className="task-item-header">
        <h3>{task.title}</h3>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        <div className="task-actions">
          <button onClick={() => onEdit(task.id)}>Edit</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
