import Button from "./Buttons/Button";
import EditTaskForm from "./TaskForms/EditTaskForm";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import "../../styles/TaskModal.css";

export default function TaskModal({ task, column, isOpen, onClose }) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  if (!isOpen) {
    return null;
  }

  function handleEditClick() {
    setIsEditFormOpen(true);
  }

  function handleTaskUpdated(updatedTask) {
    setDescription(updatedTask.description);
    //onTaskUpdated(updatedTask, taskId, columnId);
    setIsEditFormOpen(false);
  }

  function handleEditCloseForm() {
    setIsEditFormOpen(false);
  }

  return ReactDOM.createPortal(
    <div className="task-modal">
      <div className="task-modal-content">
        <button className="task-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="task-modal-main">
          <div className="task-title-section">
            <div className="task-title-icon">📋</div>
            <h1 className="task-title">{task.title}</h1>
            <div className="task-list-location">
              <p>in list {column.title}</p>
            </div>
          </div>
          <div className="task-description-section">
            <div className="description-header">
              <p className="">Description</p>
            </div>

            <div className="description-content">{description}</div>

            {/* <Button text={"Edit"} onClick={handleEditClick} /> */}
            <button className="task-edit-button" onClick={handleEditClick}>
              Edit
            </button>
            <EditTaskForm
              task={task}
              onTaskUpdated={handleTaskUpdated}
              isOpen={isEditFormOpen}
              onClose={handleEditCloseForm}
              columnId={column.id}
            />
          </div>
        </div>
      </div>
      {/* <div className="modal-overlay" onClick={onClose}></div> */}
    </div>,
    document.body
  );
}
