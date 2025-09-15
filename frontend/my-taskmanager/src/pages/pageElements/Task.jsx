import { deleteTask } from "../../api";

export default function Task({ task, onTaskDeleted }) {
  async function handleDeleteTask() {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(task.id);
        onTaskDeleted(task.id);
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

      <div style={{ border: "1px dashed gray", padding: "10px" }}>
        <button onClick={handleDeleteTask}>Delete task</button>
      </div>
    </div>
  );
}
