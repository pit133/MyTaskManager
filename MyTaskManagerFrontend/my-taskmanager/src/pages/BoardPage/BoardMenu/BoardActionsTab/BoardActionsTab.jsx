import "./BoardActionsTab.css";

export default function BoardActionsTab({ 
  board, 
  currentUser, 
  onArchiveBoard, 
  onLeaveBoard 
}) {
  const isOwner = currentUser.role === "Owner";

  return (
    <div className="menu-tab-content">
      <h4>Действия с доской</h4>

      <div className="actions-list">
        {isOwner ? (
          <div className="danger-actions">
            <h5>Опасные действия</h5>
            <button 
              onClick={onArchiveBoard}
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
              onClick={onLeaveBoard}
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