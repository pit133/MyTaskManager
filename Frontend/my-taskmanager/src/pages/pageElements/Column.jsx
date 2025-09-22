import { deleteColumn } from "../../api";
import DeleteButton from "./Buttons/DeleteButton";

export default function Column({ column, children, onColumnDeleted }) {
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

  return (
    <div
      key={column.id}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        width: "250px",
        background: "#f9f9f9",
      }}
    >
      <h2>{column.title}</h2>
      {children}
      <DeleteButton onClick={handleDeleteColumn} />
    </div>
  );
}
