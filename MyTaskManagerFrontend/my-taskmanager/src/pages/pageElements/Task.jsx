import { useState } from "react";
import DeleteButton from "./Buttons/DeleteButton.jsx";
import EditButton from "./Buttons/EditButton.jsx";
import EditTaskForm from "./TaskForms/EditTaskForm";
import {deleteTask} from "../../api.js";


export default function Task({ task, onTaskDeleted, onTaskUpdated, columnId, onTaskMove }) {

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false)

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

  function handleDragStart(e) {
    console.log("Drag started: ", task.title)

    const dragData = {
      taskId: task.id,
      sourceColumnId: columnId      
    }

    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
    e.currentTarget.style.opacity = '0.6'
  }

  function handleDragEnd(e) {
    setIsDragging(false)
    e.currentTarget.style.opacity = '1'
  }

  function handleDragOver(e) {
    e.preventDefault();
  }



  return (
    <div
      style={{
        border: "1px solid gray",
        margin: "5px 0",
        padding: "5px",
      }}
      draggable = {true}
      onDragStart={handleDragStart}
      onDragEnd = {handleDragEnd}
      onDragOver={handleDragOver}
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
