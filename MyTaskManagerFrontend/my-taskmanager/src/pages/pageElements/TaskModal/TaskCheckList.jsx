import TaskCheckListItem from "./TaskCheckListItem";
import "../../../styles/CheckList.css";
import { useState } from "react";
import AddTaslCheckListItemForm from "./AddTaskCheckListItemForm";
import DeleteTaskCheckListForm from "./DeleteTaskCheckListForm";
import EditTaskCheckListForm from "./EditTaskCheckListForm";

export default function TaskCheckList({
  checkList,
  onCheckListUpdated,
  onItemDeleted,
  onCheckListDeleted,
  onCheckListTitleUpdated,
}) {
  const [items, setItems] = useState(checkList.items || []);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  function handleSavedTitleUpdate(checkListId, checkListTitle) {
    onCheckListTitleUpdated(checkListId, checkListTitle);
    setIsEditingTitle(false);
  }

  function handleCanceledTitleUpdate() {
    setIsEditingTitle(false);
  }

  function handleDeletedItem(deletedItemId) {
    const updatedItems = items.filter((item) => item.id !== deletedItemId);
    setItems(updatedItems);
    onItemDeleted(updatedItems, checkList.id);
  }

  function handleItemUpdate(itemId, itemTitle) {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, title: itemTitle } : item
    );
    setItems(updatedItems);
    onCheckListUpdated(checkList.id, updatedItems);
  }

  function handleCompleteUpdate(itemId) {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setItems(updatedItems);
    onCheckListUpdated(checkList.id, updatedItems);
  }

  function handleSavedItem(newItem) {
    setItems([...items, newItem]);
    setIsAdding(false);
  }

  function handleCancelClick() {
    setIsAdding(false);
  }

  function handleDeleteClick() {
    setShowDeleteModal(true);
  }

  function handleDeleteCanceled() {
    setShowDeleteModal(false);
  }

  function handleDeletedCheckList(taskCheckListId) {
    onCheckListDeleted(taskCheckListId);
  }

  function handleTitleDoubleClick() {
    setIsEditingTitle(true);
  }
  

  return (
    <div className="checklist">
      <div className="checklist-header">
        <div className="checklist-header-content">
          {isEditingTitle ? (            
            <EditTaskCheckListForm
              taskcheckList={checkList}
              onSaved={handleSavedTitleUpdate}
              onCanceled={handleCanceledTitleUpdate}
            />
          ) : (            
            <>
              <h4 
                className="checklist-title" 
                onDoubleClick={handleTitleDoubleClick}
                title="Double click to edit"
              >
                {checkList.title}
              </h4>              
              <button
                className="checklist-delete-button"
                onClick={handleDeleteClick}
                title="Delete checklist"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <div className="checklist-items">
        {items.map((item) => (
          <TaskCheckListItem
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
            onCompleteUpdate={handleCompleteUpdate}
            onItemDeleted={handleDeletedItem}
          />
        ))}
      </div>

      <div className="checklist-add-item">
        {isAdding ? (
          <AddTaslCheckListItemForm
            checkListId={checkList.id}
            onSaveAddedItem={handleSavedItem}
            onCancelAddItem={handleCancelClick}
          />
        ) : (
          <button
            className="checklist-add-button"
            onClick={() => setIsAdding(true)}
          >
            + Add an item
          </button>
        )}
      </div>

      {showDeleteModal && (
        <DeleteTaskCheckListForm
          taskCheckList={checkList}
          onCanceled={handleDeleteCanceled}
          onDeleted={handleDeletedCheckList}
        />
      )}
    </div>
  );
}