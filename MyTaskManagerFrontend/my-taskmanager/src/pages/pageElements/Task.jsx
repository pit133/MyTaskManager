import React from "react";
import { useState } from "react";
import DeleteButton from "./Buttons/DeleteButton.jsx";
import EditButton from "./Buttons/EditButton.jsx";
import EditTaskForm from "./TaskForms/EditTaskForm";
import { deleteTask } from "../../api.js";

function Task(props, ref) {
  const {
    task,
    isDragging,
    style,
    onTaskDeleted,
    onTaskUpdated,
    columnId,
    ...restProps
  } = props;

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  //const [isDragging, setIsDragging] = useState(false)

  function handleEditClick() {
    setIsEditFormOpen(true);
  }

  function handleTaskUpdated(updatedTask, taskId, columnId) {
    onTaskUpdated(updatedTask, taskId, columnId);
    setIsEditFormOpen(false);
  }

  function handleCloseForm() {
    setIsEditFormOpen(false);
  }

  async function handleDeleteTask() {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(task.id);
        onTaskDeleted(task.id, columnId);
      } catch (error) {
        console.log("Failed to delete task");
        alert("Failed to delete task");
      }
    }
  }

  // function handleDragStart(e) {
  //   console.log("Drag started: ", task.title)

  //   const dragData = {
  //     taskId: task.id,
  //     sourceColumnId: columnId
  //   }

  //   e.dataTransfer.setData('application/json', JSON.stringify(dragData))
  //   e.dataTransfer.effectAllowed = 'move'
  //   setIsDragging(true)
  //   e.currentTarget.style.opacity = '0.6'
  // }

  // function handleDragEnd(e) {
  //   setIsDragging(false)
  //   e.currentTarget.style.opacity = '1'
  // }

  // function handleDragOver(e) {
  //   e.preventDefault();
  // }

  return (
    <div
      ref={ref}
      {...restProps}
      style={{
        border: "1px solid #ddd",
        margin: "8px 0",
        padding: "12px",
        background: isDragging ? "#e3f2fd" : "white",
        borderRadius: "4px",
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
        transform: isDragging ? "rotate(3deg)" : "none",
        transition: "all 0.2s ease",
        ...style,
      }}
      // onDragStart={handleDragStart}
      // onDragEnd = {handleDragEnd}
      // onDragOver={handleDragOver}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>

      <DeleteButton onClick={handleDeleteTask} />
      <EditButton onClick={handleEditClick} />

      <EditTaskForm
        task={task}
        onTaskUpdated={handleTaskUpdated}
        isOpen={isEditFormOpen}
        onClose={handleCloseForm}
        columnId={columnId}
      />
    </div>
  );
}

export default React.forwardRef(Task);
