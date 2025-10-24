import TaskCheckListItem from "./TaskCheckListItem";
import "../../styles/CheckList.css";
import { UpdateTaskCheckListItem } from "../../api";
import { useState } from "react";

export default function TaskCheckList({ checkList, onCheckListUpdated }) {
  const [items, setItems] = useState(checkList.items || []);

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

  return (
    <div className="checklist">
      <div className="checklist-header">
        <h4>{checkList.title}</h4>
      </div>

      <div className="checklist-items">
        {items.map((item) => (
          <TaskCheckListItem
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
            onCompleteUpdate={handleCompleteUpdate}
          />
        ))}
      </div>
    </div>
  );
}
