import { useState } from "react";
import { addTask } from "../../../API/taskApi";
import SubmitButton from "../../pageElements/Buttons/SubmitButton";
import Button from "../../pageElements/Buttons/Button";
import "./AddTaskForm.css";

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
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await addTask(columnId, title, description);
      onTaskAdded(result);
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="add-task-form-overlay">
      <div className="add-task-form-container">
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-header">
            <h3>Add New Task</h3>
            <button 
              type="button" 
              className="close-btn"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          <div className="form-body">
            <div className="input-group">
              <label htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                placeholder="Enter task description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows="3"
              />
            </div>
          </div>

          <div className="form-footer">
            <Button 
              text={"Cancel"} 
              onClick={onClose}
              type="button"
              className="cancel-btn"
              disabled={isLoading}
            />
            <SubmitButton 
              text={isLoading ? "Adding..." : "Add Task"} 
              loading={isLoading}
              className="submit-btn"
              disabled={!title.trim()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}