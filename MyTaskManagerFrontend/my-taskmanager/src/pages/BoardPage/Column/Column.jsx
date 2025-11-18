import React from "react";
import { useState } from "react";
import { deleteColumn } from "../../../API/columnApi";
import Button from "../../pageElements/Buttons/Button";
import EditColumnForm from "./EditColumnForm";
import AddTaskForm from "../Task/AddTaskForm";

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
    if (window.confirm("Are you sure you want to delete this column ?")) {
      try {
        await deleteColumn(column.id);
        onColumnDeleted(column.id);
      } catch (error) {
        console.log("Failed to delete column");
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

  function handleAddCLoseForm() {
    setIsAddTaskFormOpen(false);
  }

  async function handleTaskAdded(newTask){
    onTaskAdded(column.id, newTask)
  }

  return (
    <div
      ref={ref}
      {...restProps}
      style={{
        border: `2px dashed ${isDraggingOver ? "#007bff" : "#ccc"}`,
        padding: "15px",
        width: "280px",
        background: isDraggingOver ? "#f0f8ff" : "#f9f9f9",
        borderRadius: "8px",
        minHeight: "500px",
        transition: "all 0.2s ease",
      }}
    >
      <h2>{column.title}</h2>
      {children}

      <AddTaskForm
        columnId={column.id}
        onTaskAdded={handleTaskAdded}
        isOpen={isAddTaskFormOpen}
        onClose={handleAddCLoseForm}
      />

      <Button text={"Add task"} onClick={handleAddTaskClick} />
      <Button text={"Edit"} onClick={handleEditClick} />
      <EditColumnForm
        column={column}
        onColumnUpdated={handleUpdateColumn}
        isOpen={isEditFormOpened}
        onClose={handleCloseForm}
      />
      <Button text={"Delete"} onClick={handleDeleteColumn} />
    </div>
  );
}

export default React.forwardRef(Column);
