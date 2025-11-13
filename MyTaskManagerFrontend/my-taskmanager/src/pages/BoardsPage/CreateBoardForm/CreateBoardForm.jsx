import { useState } from "react";
import { createBoard } from "../../../API/boardApi";
import "./CreateBoardForm.css";

export default function CreateBoardForm({ onBoardCreated, onClosed }) {
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e) { 
    e.preventDefault(); 
    
    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }

    setCreating(true);
    setError("");
    
    try {
      const newBoard = await createBoard(boardName);
      onBoardCreated(newBoard);
      setBoardName("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create board");
    } finally {
      setCreating(false);
    }
  }

  function handleCancel() {
    onClosed();
    setBoardName("");
    setError("");
  }

  return (
    <div className="create-board-inline">
      <form onSubmit={handleSubmit} className="create-board-form-inline">
        <div className="form-row">
          <input
            type="text"
            className="form-input-inline"
            placeholder="Add board title"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            autoFocus
            maxLength={100}
          />
        </div>

        {error && (
          <div className="error-message" style={{ margin: 0 }}>
            {error}
          </div>
        )}

        <div className="form-actions-inline">
          <button
            type="submit"
            className="create-btn-inline"
            disabled={creating || !boardName.trim()}
          >
            {creating ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="cancel-btn-inline"
            onClick={handleCancel}
            disabled={creating}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}