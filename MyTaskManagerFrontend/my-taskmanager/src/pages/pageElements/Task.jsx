import React from "react";
import { useState } from "react";
import EditTaskForm from "./TaskForms/EditTaskForm";
import { deleteTask } from "../../api.js";
import Button from "./Buttons/Button.jsx";

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
  
 

  function handleEditClick() {
    setIsEditFormOpen(true);
  }

  function handleTaskUpdated(updatedTask, taskId, columnId) {
    onTaskUpdated(updatedTask, taskId, columnId);
    setIsEditFormOpen(false);
  }

  function handleEditCloseForm() {
    setIsEditFormOpen(false);
  }

  async function handleDeleteClick() {
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
    >
      <strong>{task.title}</strong>
      {/* <p>{task.description}</p> */}

      {/* <DeleteButton onClick={handleDeleteTask} /> */}
      
      <Button text={"Delete"} onClick={handleDeleteClick} />
      <Button text={"Edit"} onClick={handleEditClick} />      
      {/* <EditButton onClick={handleEditClick} /> */}
      

      <EditTaskForm
        task={task}
        onTaskUpdated={handleTaskUpdated}
        isOpen={isEditFormOpen}
        onClose={handleEditCloseForm}
        columnId={columnId}
      />
    </div>
  );
}

export default React.forwardRef(Task);
