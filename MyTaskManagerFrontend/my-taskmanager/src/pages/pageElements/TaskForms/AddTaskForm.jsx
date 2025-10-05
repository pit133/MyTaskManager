import { useState } from "react";
import { addTask } from "../../../api";
import SubmitButton from "../Buttons/SubmitButton";
import Button from "../Buttons/Button";

export default function AddTaskForm({
  columnId,
  onTaskAdded,
  isOpen,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return;
  }

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    const result = await addTask(columnId, title, description);
    onTaskAdded(result);
    setIsLoading(false);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <SubmitButton text={"Save"} loading={isLoading} />
      <Button text={"X"} onClick={onClose} />
    </form>
  );
}
