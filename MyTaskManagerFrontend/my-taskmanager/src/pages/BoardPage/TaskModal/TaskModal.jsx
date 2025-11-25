import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import "./TaskModal.css";
import { getTaskCheckLists } from "../../../API/taskCheckListApi";
import { getTaskCheckListItems } from "../../../API/taskCheckListItemApi";
import { updateTask, deleteTask, archiveTask } from "../../../API/taskApi";

import TaskCheckList from "./TaskCheckList/TaskCheckList";
import AddTaskCheckListForm from "./TaskCheckList/AddTaskCheckListForm/AddTaskCheckListForm";

export default function TaskModal({
  task,
  column,
  onTaskDeleted,
  onTaskArchived,
  onTaskTitleUpdated,
  isOpen,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [checkLists, setCheckLists] = useState([]);
  const [isAddingCheckList, setIsAddingCheckList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [labels,]  

  const labelColor = [
    "#4bce97",
    "#e2b203",
    "#f87168",
    "#9f8fef",
    "#579dff",
    "#faa53d",
    "#94c748",
    "#dcdfe4",
    "#fea362",
    "#e774bb",
    "#ff9c9c",
    "#6cc3e0",
  ];

  useEffect(() => {
    if (!isOpen || !task?.id) return;

    setTitle(task.title || "");
    setDescription(task.description || "");
    setCheckLists([]);

    loadCheckListsData();
  }, [isOpen, task?.id]);

  if (!isOpen) {
    return null;
  }

  async function loadCheckListsData() {
    setIsLoading(true);
    try {
      const checkListsData = await getTaskCheckLists(task.id);
      const checkListWithItems = await Promise.all(
        checkListsData.map(async (checkList) => {
          try {
            const itemsData = await getTaskCheckListItems(checkList.id);
            return { ...checkList, items: itemsData };
          } catch (err) {
            console.error(
              `Failed to load checklistItems ${checkList.id}:`,
              err
            );
            return { ...checkList, items: [] };
          }
        })
      );
      setCheckLists(checkListWithItems);
    } catch (err) {
      console.error("Failed to load CheckList data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCheckListTitleUpdated(checkListId, checkListTitle) {
    checkLists.map((checkList) =>
      checkList.id === checkListId
        ? (checkList.title = checkListTitle)
        : checkList
    );
  }

  function handleCancelAddCheckList() {
    setIsAddingCheckList(false);
  }

  function handleCreateCheckList(newCheckList) {
    setCheckLists([...checkLists, newCheckList]);
    setIsAddingCheckList(false);
  }

  function handleTitleKeyDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      saveTitle();
    }
    if (e.key === "Escape") {
      cancelEditingTitle();
    }
  }

  async function saveTitle() {
    try {
      setTitle(title);
      await updateTask(task.id, title, description);
      setIsEditingTitle(false);
      onTaskTitleUpdated(title, task.id, column.id);
    } catch (err) {
      console.log("Failed to update title: ", err);
    }
  }

  function cancelEditingTitle() {
    setIsEditingTitle(false);
  }

  function startEditingTitle() {
    setIsEditingTitle(true);
  }

  function handleCheckListUpadte(checklistId, updatedItems) {
    setCheckLists((prevChecklists) =>
      prevChecklists.map((checkList) =>
        checkList.id === checklistId
          ? { ...checkList, items: updatedItems }
          : checkList
      )
    );
  }

  function handleDeletedItem(items, checklistId) {
    setCheckLists((prevChecklists) =>
      prevChecklists.map((checkList) =>
        checkList.id === checklistId
          ? { ...checkList, items: items }
          : checkList
      )
    );
  }

  function handleClose() {
    setIsEditingDescription(false);
    setIsEditingTitle(false);
    setIsAddingCheckList(false);
    onClose();
  }

  function startDescriptionEditing() {
    setIsEditingDescription(true);
  }

  async function saveDescription() {
    try {
      setDescription(description);
      await updateTask(task.id, task.title, description);
      setIsEditingDescription(false);
    } catch (err) {
      console.log("Failed to update descrption: ", err);
    }
  }

  function cancelDescriptionEditing() {
    setIsEditingDescription(false);
  }

  function handleDescriptionDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      saveDescription();
    }
    if (e.key === "Escape") {
      cancelDescriptionEditing();
    }
  }

  async function handleDeleteTask() {
    if (window.confirm("Are you sure you want to delete this task ?")) {
      try {
        await deleteTask(task.id);
        onTaskDeleted(task.id, column.id);
      } catch (error) {
        console.log("Failed to delete task: ", error);
        alert("Failed to delete task");
      }
    }
    onClose();
  }

  async function handleArchiveTask() {
    try {
      await archiveTask(task.id);
      onTaskArchived(task.id, column.id);
    } catch (error) {
      console.log("Failed to delete task: ", error);
    }
    onClose();
  }

  function handleDeletedCheckList(checkListId) {
    const updatedCheckLists = checkLists.filter(
      (checkList) => checkList.id !== checkListId
    );
    setCheckLists(updatedCheckLists);
  }

  if (isLoading) return <p>Loading...</p>;

  return ReactDOM.createPortal(
    <div className="task-modal">
      <div className="task-modal-content">
        <button className="task-modal-close" onClick={handleClose}>
          ×
        </button>

        {/* ЗАГОЛОВОК на всю ширину */}
        <div className="task-title-section">
          <div className="task-title-icon">📋</div>

          {isEditingTitle ? (
            <div className="task-title-edit">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="task-title-input"
                placeholder="Enter task title..."
                autoFocus
                rows="2"
              />
              <div className="task-title-edit-actions">
                <button className="task-title-save-btn" onClick={saveTitle}>
                  Save
                </button>
                <button
                  className="task-title-cancel-btn"
                  onClick={cancelEditingTitle}
                >
                  Cancel
                </button>
                <span className="task-title-edit-hint">Ctrl+Enter to save</span>
              </div>
            </div>
          ) : (
            <div
              className="task-title-display"
              onDoubleClick={startEditingTitle}
            >
              <h1 className="task-title-text">{title}</h1>
              <span
                style={{ color: "#6b778c", fontSize: "16px", marginTop: "2px" }}
              >
                ✏️
              </span>
            </div>
          )}

          <div className="task-list-location">
            in list <span className="task-list-link">{column.title}</span>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ + SIDEBAR в одной строке */}
        <div className="task-modal-body">
          {/* Левая часть - описание и контент */}
          <div className="task-modal-main">
            <div className="task-description-section">              

              <div className="description-header">
                <div className="description-icon">📝</div>
                <h3 className="description-title">Description</h3>
              </div>

              {isEditingDescription ? (
                <div className="description-edit">
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleDescriptionDown}
                    className="description-textarea"
                    placeholder="Add a more detailed description..."
                    autoFocus
                  />
                  <div className="description-edit-actions">
                    <button className="save-btn" onClick={saveDescription}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={cancelDescriptionEditing}
                    >
                      Cancel
                    </button>
                    <span className="edit-hint">Ctrl+Enter to save</span>
                  </div>
                </div>
              ) : (
                <button
                  className={`description-content ${
                    !description ? "empty" : ""
                  }`}
                  onDoubleClick={startDescriptionEditing}
                >
                  {description || "Add a more detailed description..."}
                </button>
              )}
            </div>
            {checkLists.map((checkList) => (
              // console.log(checkList)
              <TaskCheckList
                key={checkList.id}
                checkList={checkList}
                onCheckListUpdated={handleCheckListUpadte}
                onItemDeleted={handleDeletedItem}
                onCheckListDeleted={handleDeletedCheckList}
                onCheckListTitleUpdated={handleCheckListTitleUpdated}
              />
            ))}
            <div className="checklist-add-section">
              {isAddingCheckList ? (
                <AddTaskCheckListForm
                  taskItemId={task.id}
                  onCanceled={handleCancelAddCheckList}
                  onCheckListCreated={handleCreateCheckList}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          {/* Правая часть - sidebar */}
          <div className="task-modal-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Add to card</div>
              <button className="sidebar-button">📍 Members</button>
              <button className="sidebar-button">🏷️ Labels</button>
              <button
                className="sidebar-button"
                onClick={() => setIsAddingCheckList(true)}
              >
                ✅ Checklist
              </button>
              <button className="sidebar-button">📅 Due date</button>
              <button className="sidebar-button">📎 Attachment</button>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Actions</div>
              <button className="sidebar-button">➡️ Move</button>
              <button className="sidebar-button">📋 Copy</button>
              <button className="sidebar-button" onClick={handleArchiveTask}>
                📁 Archive
              </button>
              <button
                className="sidebar-button delete"
                onClick={handleDeleteTask}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,

    document.body
  );
}
