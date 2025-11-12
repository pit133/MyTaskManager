import "./BoardHeader.css";

export default function BoardHeader({boardName, members, onOpened}){
    
    function openInviteModal(){
        onOpened()
    }

    return(
        <div className="board-header">
      <div className="board-header-left">
        <div className="board-info">
          <div className="board-icon">📋</div>
          <h1 className="board-title">{boardName || "Board"}</h1>
          {/* <span className="board-visibility">{boardInfo?.visibility}</span> */}
        </div>
        
        <div className="members-section">
          <span className="members-label">Team:</span>
          <div className="members-avatars">
            {members.slice(0, 5).map((member, index) => (
              <div key={member.id} className="member-avatar" title={member.user?.name}>
                {member.user?.name?.[0]?.toUpperCase() || 'Петя Гейминг'}
              </div>
            ))}
            {members.length > 5 && (
              <div className="member-avatar more" title={`${members.length - 5} more members`}>
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="board-header-right">
        <div className="header-actions">
          <button className="header-button">
            <span>⭐</span>
            Favorite
          </button>
          <button className="header-button">
            <span>⚙️</span>
            Menu
          </button>
        </div>
        
        <button className="invite-button" onClick={openInviteModal}>
          <span>👥</span>
          Invite
        </button>
      </div>
    </div>
    )
}