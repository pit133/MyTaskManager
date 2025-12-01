import { useState } from "react";

export default function LabelsMenu({
  boardLabels,
  taskLabels,
  isOpened,  
  onAddedTaskLabel,
  onRemovedTaskLabel,
  onRemovedBoardLabel,
  onCreateLabelFormOpened,
}) {
  const [activeTab, setActiveTab] = useState("available");

  if (!isOpened) return null;


  const availableLabels = boardLabels.filter(
    (boardLabel) =>
      !taskLabels?.some((taskLabel) => taskLabel.id === boardLabel.id)
  );

  const assignedLabels = boardLabels.filter((boardLabel) =>
    taskLabels?.some((taskLabel) => taskLabel.id === boardLabel.id)
  );

  return (
    <div className="labels-menu">
      <div className="switch-menu">
        <button
          type="button"
          onClick={() => setActiveTab("available")}
          className={activeTab === "available" ? "active" : ""}
        >
          Available ({availableLabels.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("assigned")}
          className={activeTab === "assigned" ? "active" : ""}
        >
          Assigned ({assignedLabels.length})
        </button>
      </div>

      <div className="labels-content">
        {activeTab === "available" ? (
          <div>
            {availableLabels.length > 0 ? (
              availableLabels.map((label) => (
                <div key={label.id}>
                  <button
                    type="button"                    
                    onClick={() => onAddedTaskLabel(label)}
                    style={{ background: label.color }}
                    className="label-button"
                  >
                    {label.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemovedBoardLabel(label.id)}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <div>No available labels</div>
            )}
          </div>
        ) : (
          <div>
            {assignedLabels.length > 0 ? (
              assignedLabels.map((label) => (
                <button
                  type="button"
                  key={label.id}
                  onClick={() => onRemovedTaskLabel(label.id)}
                  style={{ background: label.color }}
                  className="label-button assigned"
                >
                  {label.title} ✓
                </button>
              ))
            ) : (
              <div>No assigned labels</div>
            )}
          </div>
        )}
      </div>

      <button onClick={onCreateLabelFormOpened}>Add new label</button>
    </div>
  );
}
