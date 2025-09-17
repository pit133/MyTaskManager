export default function EditTaskButton({onClick}){

    

    return(
        <div style={{ border: "1px dashed gray", padding: "10px" }}>
      <button onClick={onClick}>Edit task</button>
    </div>
    )
}