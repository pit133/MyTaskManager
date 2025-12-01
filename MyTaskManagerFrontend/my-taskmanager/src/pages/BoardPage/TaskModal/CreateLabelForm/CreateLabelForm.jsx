import { useState } from "react";
import { addBoardLabel } from "../../../../API/LabelApi";

export default function CreateLabelForm({
  isOpened,
  onAddedBoardLabel,
  onClosed,
}) {
  const [labelTitle, setLabelTitle] = useState("");
  const [pickedColor, setPickedColor] = useState("");

  const labelColors = [
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

  if (!isOpened) return;

  function handleAddLabel() {
    const label = { title: labelTitle, color: pickedColor };
    onAddedBoardLabel(label);
    onClosed();
  }

  return (
    <div>
      <div>
        <label>Label title</label>
        <input
          placeholder="Enter label title"
          value={labelTitle}
          onChange={(e) => setLabelTitle(e.target.value)}
        />
      </div>

      <div>
        {labelColors.map((labelColor) => (
          <div
            key={labelColor}
            style={{
              background: labelColor,
              height: "20px",
              width: "20px",
            }}
            onClick={() => setPickedColor(labelColor)}
          ></div>
        ))}
      </div>

      <button type="button" style={{ background: pickedColor }}>
        {labelTitle}
      </button>
      <button type="submit" onClick={handleAddLabel}>
        Create Label
      </button>
    </div>
  );
}
