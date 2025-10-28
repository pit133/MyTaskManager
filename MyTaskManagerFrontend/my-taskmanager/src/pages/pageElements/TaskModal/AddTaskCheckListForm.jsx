import { useState } from "react";
import "../../../styles/CheckList.css";
import "../../../api";
import { createTaskCheckList } from "../../../api";

export default function AddTaskCheckListForm({
  taskItemId,
  onCanceled,
  onCheckListCreated,
}) {
  const [newCheckListTitle, setNewCheckListTitle] = useState();

  function handleCheckListKeyDown(e) {
    if (e.key === "Enter") {
      handleAddCheckList();
    } else if (e.key === "Escape") {
      handleCancelAddCheckList();
    }
  }

  async function handleAddCheckList() {
    try {
      const newCheckList = await createTaskCheckList(
        taskItemId,
        newCheckListTitle.trim()
      );
      onCheckListCreated(newCheckList);
    } catch (error) {
      console.error("Failed to create CheckList");
    }
  }

  function handleCancelAddCheckList() {
    setNewCheckListTitle("");
    onCanceled();
  }

  return (
    <div className="checklist-add-form">
      <textarea
        value={newCheckListTitle}
        onChange={(e) => setNewCheckListTitle(e.target.value)}
        onKeyDown={handleCheckListKeyDown}
        className="checklist-add-input"
        placeholder="Add checklist title..."
        autoFocus
        rows="2"
      />
      <div className="checklist-add-actions">
        <button
          className="checklist-add-save"
          onClick={handleAddCheckList}
          //disabled={!newCheckListTitle.trim()}
        >
          Add Checklist
        </button>
        <button
          className="checklist-add-cancel"
          onClick={handleCancelAddCheckList}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
