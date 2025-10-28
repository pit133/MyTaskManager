import { useState } from "react";
import "../../../styles/CheckList.css";
import {
  changeCheckListItemIsComplete,
  deleteTaskCheckListItem,
  UpdateTaskCheckListItem,
} from "../../../api";

export default function TaskCheckListItem({
  item,
  onUpdate,
  onCompleteUpdate,
  onItemDeleted,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  console.log("Checklist item:", item);

  async function handleSave() {
    if (editTitle.trim()) {
      try {
        await UpdateTaskCheckListItem(item.id, editTitle.trim());
        onUpdate(item.id, editTitle.trim());
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update checklist item:", err);
      }
    }
  }

  async function handleCheckboxChanged() {
    try {
      await changeCheckListItemIsComplete(item.id);
      onCompleteUpdate(item.id);
    } catch (err) {
      console.error("Failed to update checklist item completion:", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(item.title);
      setIsEditing(false);
    }
  }

  async function handleDeleteClick() {
    try {
      await deleteTaskCheckListItem(item.id);
      onItemDeleted(item.id);
    } catch (error) {
      console.log("Failed to delete CheckList item:", error);
    }
  }

  return (
    <div className="checklist-item">
      <input
        type="checkbox"
        checked={item.isCompleted}
        onChange={handleCheckboxChanged}
      />

      {isEditing ? (
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="checklist-item-input"
          autoFocus
        />
      ) : (
        <span
          className={`checklist-item-text ${
            item.isCompleted ? "completed" : ""
          }`}
          onDoubleClick={() => {
            setEditTitle(item.title);
            setIsEditing(true);
          }}
        >
          {item.title}
        </span>
      )}

      <button className="checklist-item-delete" onClick={handleDeleteClick}>
        ×
      </button>
    </div>
  );
}
