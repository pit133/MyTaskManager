import { useNavigate } from "react-router-dom";
import "./BoardCard.css";
export default function BoardCard({board, showOwner = false}){
    const navigate = useNavigate()

    return(
        <div 
      className="board-card"
      onClick={() => navigate(`/boards/${board.id}`)}
    >
      <div className="board-card-header">
        <div className="board-name">{board.name}</div>
        <div className={`board-role ${board.role?.toLowerCase()}`}>
          {board.role === "Owner" ? "👑" : ""}
          {board.role}
        </div>
      </div>
      
      <div className="board-meta">
        {showOwner && board.ownerName && (
          <div className="board-owner">
            <span>👤</span>
            <span>by {board.ownerName}</span>
          </div>
        )}
      </div>
    </div>
    )
}