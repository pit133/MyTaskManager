import { useState } from "react";
import { deleteTaskCheckList } from "../../../api";

export default function DeleteTaskCheckListForm({
  taskCheckList,
  onCanceled,
  onDeleted,
}) {
  const [isDeleting, setIsDeliting] = useState(false);

  function handleCancelDelete() {
    onCanceled();
  }

  async function handleDeleteCheckList() {
    try {
      setIsDeliting(true);
      onDeleted(taskCheckList.id);
      await deleteTaskCheckList(taskCheckList.id);
    } catch (err) {
      console.error("Failed delete CheckList: ", err);
    } finally {
      setIsDeliting(false);
    }
  }
  return (
    <div className="checklist-delete-modal">
      <div className="checklist-delete-modal-content">
        <h3 className="checklist-delete-modal-title">Delete Checklist</h3>
        <p className="checklist-delete-modal-text">
          Are you sure you want to delete the checklist "{taskCheckList.title}"?
          This action cannot be undone and all items in this checklist will be
          permanently removed.
        </p>
        <div className="checklist-delete-modal-actions">
          <button
            className="checklist-delete-cancel"
            onClick={handleCancelDelete}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="checklist-delete-confirm"
            onClick={handleDeleteCheckList}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
