import { useState } from "react";
import { deleteColumn } from "../../api";
import DeleteButton from "./Buttons/DeleteButton";
import EditButton from "./Buttons/EditButton";
import EditColumnForm from "./ColumnForms/EditColumnForm";

export default function Column({
  column,
  children,
  onColumnUpdated,
  onColumnDeleted,
  onTaskMove
}) {
  const [isEditFormOpened, setIsEditFormOpened] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false)

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
    //onTaskDeleted(task.id, columnId);
  }

  async function handleUpdateColumn(updatedColumn) {
    onColumnUpdated(updatedColumn)
    setIsEditFormOpened(false)
  }

  function handleEditClick() {
    setIsEditFormOpened(true);
  }

  function handleCloseForm(){
    setIsEditFormOpened(false)
  }

  function handleDragOver(e){
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  function handleDragLeave(e){
    if(e.currentTarget.contains(e.relatedTarget)){
      setIsDragOver(false)
    }
  }

  function handleDrop(e){
    e.preventDefault()
    setIsDragOver(false)

    try{
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'))

      if(dragData.sourceColumnId !== column.id){
        onTaskMove(dragData.taskId, column.id)
      }
    } catch (error){
      console.error("Error parsing drag data:", error)
    }
  }

  return (
    <div
      key={column.id}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        width: "250px",
        background: "#f9f9f9",
      }}
      onDragOver={handleDragOver}
      onDragLeave = {handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>{column.title}</h2>
      {children}
      <EditButton onClick={handleEditClick} />
      <EditColumnForm
        column={column}
        onColumnUpdated={handleUpdateColumn}
        isOpen={isEditFormOpened}
        onClose={handleCloseForm}
      />
      <DeleteButton onClick={handleDeleteColumn} />
    </div>
  );
}
