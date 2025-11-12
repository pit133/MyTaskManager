import { useState, useEffect,useRef } from "react";
import { updateTaskCheckList } from "../../../../../api";
import "./EditTaskCheckListForm.css";

export default function EditTaskCheckListForm(
  {taskcheckList,
  onSaved,
  onCanceled}
) {
  const [checkListTitle, setCheckListTitle] = useState(taskcheckList.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null)


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();      
      //inputRef.current.select();
    }
  }, []);

  function handleTitleKeyDown(e) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }

  function handleCancel() {
    onCanceled();
  }

  async function handleSave() {
    try{
        setIsSaving(true)
        onSaved(taskcheckList.id, checkListTitle.trim())
        await updateTaskCheckList(taskcheckList.id, checkListTitle.trim())
    }
    catch(err){
        console.error("Failed to update ChekList title: " + err)
    }
    finally{
        setIsSaving(false)
    }

  }

  return (
    <div className="checklist-title-edit">
      <textarea
        ref={inputRef}
        value={checkListTitle}
        onChange={(e) => setCheckListTitle(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        onBlur={handleSave}
        className="checklist-title-input"
        placeholder="Enter checklist title..."
        rows="2"
        disabled={isSaving}
      />
    </div>
  );
}
