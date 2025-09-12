export default function Task({task}) {
  return (
    <div
      style={{
        border: "1px solid gray",
        margin: "5px 0",
        padding: "5px",
      }}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
    </div>
  );
}
