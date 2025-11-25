import { useNavigate } from "react-router-dom";
import { archiveBoard } from "../../../../API/boardApi";
import "./BoardActionsTab.css";
import { leaveBoard } from "../../../../API/boardMembersApi";

export default function BoardActionsTab({ 
  board, 
  currentUser,    
}) {
  const isOwner = currentUser.role === "Owner";
  const navigate = useNavigate()

  async function handleLeaveBoard(){
    try{
    await leaveBoard(board.id)
    navigate("/boards")}
    catch(error){
      console.error("Failed to delete board member: ", error)
    }
  }

  async function handleArchiveBoard() {
    try{      
      await archiveBoard(board.id)
      navigate("/boards")    
    }
    catch(error){
      console.error("Filed to archive board: ", error)
    }    
  }  

  return (
    <div className="menu-tab-content">
      <h4>Действия с доской</h4>

      <div className="actions-list">
        {isOwner ? (
          <div className="danger-actions">
            <h5>Опасные действия</h5>
            <button 
              onClick={handleArchiveBoard}
              className="danger-btn archive-btn"
            >
              📦 Архивировать доску
            </button>
            <p className="action-description">
              Архивирование скроет доску из основного списка
            </p>
          </div>
        ) : (
          <div className="danger-actions">
            <h5>Выход из доски</h5>
            <button 
              onClick={handleLeaveBoard}
              className="danger-btn leave-btn"
            >
              🚪 Покинуть доску
            </button>
            <p className="action-description">
              Вы больше не будете иметь доступ к этой доске
            </p>
          </div>
        )}
      </div>
    </div>
  );
}