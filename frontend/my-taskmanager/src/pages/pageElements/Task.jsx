import { useState } from "react";
import DeleteTaskButton from "./TaskButtons/DeleteTaskButton"
import EditTaskButton from "./TaskButtons/EditTaskButton";
import EditTaskForm from "./TaskForms/EditTaskForm";

export default function Task({ task, onTaskDeleted, onTaskUpdated, columnId }) {

  const[isEditFormOpen, setIsEditFormOpen] = useState(false)

  function handleEditClick(){
    setIsEditFormOpen(true)
  }

  function handleTaskUpdated(updatedTask, taskId, columnId) {
    onTaskUpdated(updatedTask, taskId, columnId)
    setIsEditFormOpen(false)

  }

  function handleCloseForm(){
    setIsEditFormOpen(false)
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

      <DeleteTaskButton taskId={task.id} onTaskDeleted={onTaskDeleted} />
      <EditTaskButton task ={task} onClick={handleEditClick} />

      <EditTaskForm  
      task ={task}
      onTaskUpdated ={handleTaskUpdated}
      isOpen ={isEditFormOpen}
      onClose ={handleCloseForm}
      columnId={columnId}/>
    </div>
  );
}
