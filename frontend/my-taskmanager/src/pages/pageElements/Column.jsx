export default function Column({column, children}){
    return(
        <div
            key={column.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "250px",
              background: "#f9f9f9",
            }}
          >
            <h2>{column.title}</h2>  
            {children}
            </div>
    )
}