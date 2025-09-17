import { useEffect, useState } from "react";
import { updateTask } from "../../../api";

export default function EditTaskForm({
  task,
  onTaskUpdated,
  isOpen,
  onClose,
  columnId,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);

    try {
      await updateTask(task.id, title.trim(), description.trim());

      const updatedTask = {
        ...task,
        title: title.trim(),
        description: description.trim(),
      };

      onTaskUpdated(updatedTask, task.id, columnId);
      onClose();
    } catch (err) {
      setError("Failed to update task");
      console.log(error);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        ></input>

        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          Save
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
