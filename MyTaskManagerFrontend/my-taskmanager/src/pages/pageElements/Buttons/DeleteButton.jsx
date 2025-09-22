export default function DeleteButton({ onClick }) {
  return (
    <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <button onClick={onClick}>Delete</button>
    </div>
  );
}
