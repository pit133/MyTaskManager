import React from "react";
import { useState } from "react";
import { deleteColumn } from "../../../API/columnApi";
import Button from "../../pageElements/Buttons/Button";
import EditColumnForm from "./EditColumnForm";
import AddTaskForm from "../Task/AddTaskForm";
import "./Column.css";

function Column(props, ref) {
  const {
    column,
    children,
    isDraggingOver,
    onColumnUpdated,
    onColumnDeleted,
    onTaskAdded,
    ...restProps
  } = props;

  const [isEditFormOpened, setIsEditFormOpened] = useState(false);
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);

  async function handleDeleteColumn() {
    if (window.confirm("Are you sure you want to delete this column?")) {
      try {
        await deleteColumn(column.id);
        onColumnDeleted(column.id);
      } catch (error) {
        console.error("Failed to delete column");
        alert("Failed to delete column");
      }
    }
  }

  async function handleUpdateColumn(updatedColumn) {
    onColumnUpdated(updatedColumn);
    setIsEditFormOpened(false);
  }

  function handleEditClick() {
    setIsEditFormOpened(true);
  }

  function handleCloseForm() {
    setIsEditFormOpened(false);
  }

  function handleAddTaskClick() {
    setIsAddTaskFormOpen(true);
  }

  function handleAddCloseForm() {
    setIsAddTaskFormOpen(false);
  }

  async function handleTaskAdded(newTask) {
    onTaskAdded(column.id, newTask);
    setIsAddTaskFormOpen(false);
  }

  return (
    <div
      ref={ref}
      {...restProps}
      className={`column ${isDraggingOver ? "dragging-over" : ""}`}
    >
      {/* Заголовок колонки */}
      <div className="column-header">
        {isEditFormOpened ? (
          <EditColumnForm
            column={column}
            onColumnUpdated={handleUpdateColumn}
            isOpen={isEditFormOpened}
            onClose={handleCloseForm}
          />
        ) : (
          <>
            <h3 className="column-title">{column.title}</h3>
            <div className="column-actions">
              <button
                className="column-action-btn edit"
                onClick={handleEditClick}
                title="Edit column"
              >
                ✏️
              </button>
              <button
                className="column-action-btn delete"
                onClick={handleDeleteColumn}
                title="Delete column"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      <div className="tasks-container">
        {children}
      </div>

      <button className="add-task-btn" onClick={handleAddTaskClick}>
        <span>+</span>
        Add task
      </button>

      <AddTaskForm
        columnId={column.id}
        onTaskAdded={handleTaskAdded}
        isOpen={isAddTaskFormOpen}
        onClose={handleAddCloseForm}
      />
    </div>
  );
}

export default React.forwardRef(Column);