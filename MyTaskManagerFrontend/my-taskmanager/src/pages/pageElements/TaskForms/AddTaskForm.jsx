import { useState } from "react";
import { addTask } from "../../../api";

export default function AddTaskForm({ columnId, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async () => {
    if (!title.trim()) return;

    const result = await addTask(columnId, title, description);
    onTaskAdded(result);
    setTitle("");
    setDescription("");
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddTask}>Add task</button>
    </div>
  );
}
