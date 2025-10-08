import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import "../../styles/TaskModal.css";
import { updateTask, deleteTask, archiveTask } from "../../api";

export default function TaskModal({
  task,
  column,
  onTaskDeleted,
  onTaskArchived,
  isOpen,
  onClose,
}) {
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    setIsEditing(false);
    onClose();
  }

  function startEditing() {
    setIsEditing(true);
  }

  async function saveDescription() {
    try {
      setDescription(description);
      await updateTask(task.id, task.title, description);
      setIsEditing(false);
    } catch (err) {
      console.log("Failed to update descrption: ", err);
    }
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      saveDescription();
    }
    if (e.key === "Escape") {
      cancelEditing();
    }
  }

  async function handleDeleteTask() {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(task.id);
        onTaskDeleted(task.id, column.id);
      } catch (error) {
        console.log("Failed to delete task: ", error);
        alert("Failed to delete task");
      }
    }
    onClose();
  }

  async function handleArchiveTask() {
    try{
      await archiveTask(task.id)
      onTaskArchived(task.id, column.id)
      
    }
    catch(error){
      console.log("Failed to delete task: ", error)
    }
    onClose()
  }

  return ReactDOM.createPortal(
    <div className="task-modal">
      <div className="task-modal-content">
        <button className="task-modal-close" onClick={handleClose}>
          ×
        </button>

        {/* ЗАГОЛОВОК на всю ширину */}
        <div className="task-title-section">
          <div className="task-title-icon">📋</div>
          <h1 className="task-title">{task.title}</h1>
          <div className="task-list-location">
            in list <span className="task-list-link">{column.title}</span>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ + SIDEBAR в одной строке */}
        <div className="task-modal-body">
          {/* Левая часть - описание и контент */}
          <div className="task-modal-main">
            <div className="task-description-section">
              <div className="description-header">
                <div className="description-icon">📝</div>
                <h3 className="description-title">Description</h3>
              </div>

              {isEditing ? (
                <div className="description-edit">
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="description-textarea"
                    placeholder="Add a more detailed description..."
                    autoFocus
                  />
                  <div className="description-edit-actions">
                    <button className="save-btn" onClick={saveDescription}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={cancelEditing}>
                      Cancel
                    </button>
                    <span className="edit-hint">Ctrl+Enter to save</span>
                  </div>
                </div>
              ) : (
                <button
                  className={`description-content ${
                    !description ? "empty" : ""
                  }`}
                  onDoubleClick={startEditing}
                >
                  {description || "Add a more detailed description..."}
                </button>
              )}
            </div>
          </div>

          {/* Правая часть - sidebar */}
          <div className="task-modal-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Add to card</div>
              <button className="sidebar-button">📍 Members</button>
              <button className="sidebar-button">🏷️ Labels</button>
              <button className="sidebar-button">✅ Checklist</button>
              <button className="sidebar-button">📅 Due date</button>
              <button className="sidebar-button">📎 Attachment</button>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Actions</div>
              <button className="sidebar-button">➡️ Move</button>
              <button className="sidebar-button">📋 Copy</button>
              <button className="sidebar-button" onClick={handleArchiveTask}>📁 Archive</button>
              <button
                className="sidebar-button delete"
                onClick={handleDeleteTask}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
