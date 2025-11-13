import { useState } from "react";
import "./AddTaskCheckListForm/AddTaskCheckListForm.css";
import { addCheckListItem } from "../../../../API/taskCheckListItemApi";

export default function AddTaslCheckListItemForm(
  {checkListId,
  onSaveAddedItem,
  onCancelAddItem}
) {
  const [newItemText, setNewItemText] = useState("");

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSaveNewItemClick();
    } else if (e.key === "Escape") {
      handleCancelAddClick();
    }
  }

  async function handleSaveNewItemClick() {
    try {
      const newItem = await addCheckListItem(checkListId, newItemText);
      onSaveAddedItem(newItem);
    } catch (error) {
      console.error("Failed add new ChecKListItem");
    }
  }

  function handleCancelAddClick() {
    onCancelAddItem()
  }

  return (
    <div className="checklist-add-form">
      <textarea
        value={newItemText}
        onChange={(e) => setNewItemText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="checklist-add-input"
        placeholder="Add an item..."
        autoFocus
        rows="2"
      />
      <div className="checklist-add-actions">
        <button className="checklist-add-save" onClick={handleSaveNewItemClick}>
          Add
        </button>
        <button className="checklist-add-cancel" onClick={handleCancelAddClick}>
          Cancel
        </button>
      </div>
    </div>
  );
}
