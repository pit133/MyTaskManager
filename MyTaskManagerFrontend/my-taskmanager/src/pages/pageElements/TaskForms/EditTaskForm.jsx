import { useEffect, useState } from "react";
import { updateTask } from "../../../api";
import SaveButton from "../Buttons/SubmitButton";
import CancelButton from "../Buttons/CancelButton";

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

    try {
      await updateTask(task.id, title.trim(), description.trim());
      setLoading(true);
      const updatedTask = {
        ...task,
        title: title.trim(),
        description: description.trim(),
      };

      onTaskUpdated(updatedTask, task.id, columnId);
      setLoading(false);
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

        <SaveButton text={"Save"} loading={loading} />
        <CancelButton text={"X"} onClick={onClose} />        
      </form>
    </div>
  );
}
