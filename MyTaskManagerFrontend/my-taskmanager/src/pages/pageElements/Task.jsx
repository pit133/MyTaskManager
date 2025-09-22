import { useState } from "react";
import DeleteButton from "./Buttons/DeleteButton.jsx";
import EditButton from "./Buttons/EditButton.jsx";
import EditTaskForm from "./TaskForms/EditTaskForm";
import {deleteTask} from "../../api.js";


export default function Task({ task, onTaskDeleted, onTaskUpdated, columnId }) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

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

 async function handleDeleteTask(){
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(task.id);
        onTaskDeleted(task.id, columnId)        
      } catch (error) {
        console.log("Failed to delete task");
        alert("Failed to delete task");
      }
    }
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        margin: "5px 0",
        padding: "5px",
      }}
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
