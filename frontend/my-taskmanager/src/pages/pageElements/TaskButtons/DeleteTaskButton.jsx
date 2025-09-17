import { deleteTask } from "../../../api";

export default function DeleteTaskButton({ taskId, onTaskDeleted }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(taskId);
        onTaskDeleted(taskId);
      } catch (error) {
        console.log("Failed to delete task");
        alert("Failed to delete task");
      }
    }
  };

  return (
    <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <button onClick={handleDelete}>Delete task</button>
    </div>
  );
}
