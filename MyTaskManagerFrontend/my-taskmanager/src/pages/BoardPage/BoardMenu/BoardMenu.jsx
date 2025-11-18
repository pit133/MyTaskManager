import { useState } from "react";
import "./BoardMenu.css";
import BoardMembersTab from "./BoardMembersTab/BoardMembersTab";
import BoardActionsTab from "./BoardActionsTab/BoardActionsTab";
export default function BoardMenu({ 
  board, 
  members, 
  currentUser, 
  onClose,   
  onArchiveBoard,
  onLeaveBoard,
  onUpdateMemberRole,
  onDeleteBoardMember
}) {
  const [activeTab, setActiveTab] = useState("members");

  function handleUpdateMemberRole(memberId, role){
    onUpdateMemberRole(memberId, role)    
  }

  function handleDeleteBoardMember(memberId){
    onDeleteBoardMember(memberId)
  }
  
  return (
    <div className="board-menu-overlay" onClick={onClose}>
      <div className="board-menu" onClick={(e) => e.stopPropagation()}>
        <div className="board-menu-header">
          <h3>Меню доски</h3>
          <button className="board-menu-close" onClick={onClose}>×</button>
        </div>

        <div className="board-menu-content">
          <div className="board-menu-sidebar">
            <button 
              className={`menu-tab ${activeTab === "members" ? "active" : ""}`}
              onClick={() => setActiveTab("members")}
            >
              👥 Участники
            </button>
            <button 
              className={`menu-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Настройки
            </button>
            <button 
              className={`menu-tab ${activeTab === "actions" ? "active" : ""}`}
              onClick={() => setActiveTab("actions")}
            >
              🔧 Действия
            </button>
          </div>

          <div className="board-menu-main">
            {activeTab === "members" && (
              <BoardMembersTab 
                members={members}
                currentUser={currentUser}
                onUpdateMemberRole = {handleUpdateMemberRole}
                onDeleteBoardMember={handleDeleteBoardMember}
              />
            )}

            {/* {activeTab === "settings" && (
              <BoardSettingsTab 
                board={board}
                currentUser={currentUser}
              />
            )} */}

            {activeTab === "actions" && (
              <BoardActionsTab 
                board={board}
                currentUser={currentUser}
                onArchiveBoard={onArchiveBoard}
                onLeaveBoard={onLeaveBoard}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}