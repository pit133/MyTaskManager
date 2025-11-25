import { useState } from "react";
import { addColumn } from "../../../API/columnApi";
import "./AddColumnForm.css";

export default function AddColumnForm({ boardId, onColumnAdded }) {
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function handleSubmitColumn(e) {
    e.preventDefault();

    if (!newColumnName.trim()) {
      setError("Column name cannot be empty");
      return;
    }

    try {
      const result = await addColumn(boardId, newColumnName);
      onColumnAdded(result);
      setNewColumnName("");
      setError("");
      setIsFormOpen(false);
    } catch (err) {
      setError("Failed to add new column");
      console.error(err);
    }
  }

  function handleCancel() {
    setNewColumnName("");
    setError("");
    setIsFormOpen(false);
  }

  function handlePromptClick() {
    setIsFormOpen(true);
  }

  if (!isFormOpen) {
    return (
      <div className="add-column-form">
        <button className="add-column-prompt" onClick={handlePromptClick}>
          <span className="add-column-icon">+</span>
          <span className="add-column-text">Add another column</span>
        </button>
      </div>
    );
  }

  return (
    <div className="add-column-form open">
      <form onSubmit={handleSubmitColumn} className="add-column-form-content">
        <input
          type="text"
          className="column-input"
          placeholder="Enter column title..."
          value={newColumnName}
          onChange={(e) => {
            setNewColumnName(e.target.value);
            setError("");
          }}
          autoFocus
          maxLength={100}
        />
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="add-column-btn"
            disabled={!newColumnName.trim()}
          >
            Add column
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}