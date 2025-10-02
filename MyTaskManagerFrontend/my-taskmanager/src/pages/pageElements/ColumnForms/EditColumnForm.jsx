import { useEffect, useState } from "react";
import SaveButton from "../Buttons/SubmitButton";
import Button from "../Buttons/Button";
import { updateColumn } from "../../../api";

export default function EditColumnForm({
  column,
  onColumnUpdated,
  isOpen,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(column.title);
  }, [column]);

  if (!isOpen) {
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await updateColumn(column.id, title.trim());
      setLoading(true);
      const updatedColumn = {
        ...column,
        title: title.trim(),
      };

      onColumnUpdated(updatedColumn);
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Unable to update column");
      console.log(err);
    }
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

        <SaveButton text={"Save"} loading={loading} />
        <Button text={"X"} onClick={onClose} />
      </form>
    </div>
  );
}
