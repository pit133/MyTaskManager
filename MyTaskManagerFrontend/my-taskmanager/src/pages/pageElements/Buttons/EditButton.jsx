export default function EditButton({ onClick }) {
  return (
    <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <button onClick={onClick}>Edit</button>
    </div>
  );
}
