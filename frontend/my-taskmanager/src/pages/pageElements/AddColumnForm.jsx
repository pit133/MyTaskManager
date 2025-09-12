import { useState } from "react";
import { addColumn } from "../../api";

export default function AddColumnForm({ boadId, onColumnAdded }) {
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmitColumn(e) {
    e.preventDefault();

    if (!newColumnName.trim()) {
      setError("Column name can not be empty");
      return;
    }

    try {
      const result = await addColumn(boadId, newColumnName);
      onColumnAdded(result);
      setNewColumnName("");
      setError("");
    } catch (err) {
      setError("Failed to add new Column");
      console.error(err);
    }
  }

  return (
    <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <form onSubmit={handleSubmitColumn}>
        <input
          type="text"
          placeholder="New column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <br />
        <button type="submit">Add new column</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
