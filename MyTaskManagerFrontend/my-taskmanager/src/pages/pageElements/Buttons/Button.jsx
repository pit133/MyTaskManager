export default function Button({text, onClick }) {
  return (
    <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <button onClick={onClick}>{text}</button>
    </div>
  );
}