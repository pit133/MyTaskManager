import { useEffect, useState } from "react";
import SubmitButton from "../../pageElements/Buttons/SubmitButton";
import Button from "../../pageElements/Buttons/Button";
import { updateColumn } from "../../../API/columnApi";
import "./EditColumnForm.css";

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
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      await updateColumn(column.id, title.trim());
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
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div className="inline-edit-form-container">
      <form onSubmit={handleSubmit} className="inline-edit-form">
        <div className="form-input-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="inline-title-input"
            placeholder="Enter column title..."
            autoFocus
          />
          
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="form-buttons">
          <SubmitButton 
            text={"✓"} 
            loading={loading}
            className="inline-save-button"
          />
          <Button 
            text={"✕"} 
            onClick={onClose}
            className="inline-cancel-button"
          />
        </div>
      </form>
    </div>
  );
}