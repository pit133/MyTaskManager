import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBoardsNames, getMembershipBoards, getToken } from "../../api";
import BoardCard from "./BoardCard";
import CreateBoardForm from "./CreateBoardForm";
import "./BoardsPage.css";

export default function BoardsPage() {
  const [ownedBoards, setOwnedBoards] = useState([]);
  const [memberedBoards, setMemberedBoards] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleCreatedBoard(newBoard) {
    setOwnedBoards([...ownedBoards, newBoard]);
    setShowCreateForm(false);
  }

  function handleClosedForm() {
    setShowCreateForm(false);
  }

  async function loadBoards() {
    try {
      setLoading(true);
      const ownedBoardsData = await getBoardsNames();
      const memberedBoardsData = await getMembershipBoards();
      setOwnedBoards(ownedBoardsData);
      setMemberedBoards(memberedBoardsData);
    } catch (err) {
      setError("Failed to load boards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    loadBoards();
  }, [navigate]);

  if (loading)
    return (
      <div className="loading-spinner">
        <div>Loading boards...</div>
      </div>
    );

  return (
    <div className="boards-page">
      <div className="boards-header">
        <h1 className="boards-title">Boards</h1>
        <p className="boards-subtitle">
          Manage your workspaces and collaborate with your team
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="boards-sections">
        {/* Мои доски */}
        <div className="boards-section">
          <div className="section-title">
            <span>📋</span>
            Your Boards
          </div>

          {ownedBoards.length === 0 ? (
            <div className="empty-state-create">
              {showCreateForm ? (
                <CreateBoardForm
                  onBoardCreated={handleCreatedBoard}
                  OnClosed={handleClosedForm}
                />
              ) : (
                <div
                  className="create-prompt"
                  onClick={() => setShowCreateForm(true)}
                >
                  <div className="create-prompt-icon">📋</div>
                  <div className="create-prompt-text">
                    Create your first board
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="boards-grid">
              {ownedBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
              
              {showCreateForm ? (
                <CreateBoardForm
                  onBoardCreated={handleCreatedBoard}
                  onClosed={handleClosedForm}
                />
              ) : (
                <div
                  className="board-card create-new-card"
                  onClick={() => setShowCreateForm(true)}
                >
                  <div className="create-new-card-content">
                    <div className="create-new-card-icon">+</div>
                    <div className="create-new-card-text">Create new board</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Участие в досках */}
        <div className="boards-section">
          <div className="section-title">
            <span>👥</span>
            Shared with you
          </div>

          {memberedBoards.length === 0 ? (
            <div>
              {/* icon="👥" */}
              <h4>You're not a member of any shared boards yet</h4>
            </div>
          ) : (
            <div className="boards-grid">
              {memberedBoards.map((board) => (
                <BoardCard key={board.id} board={board} showOwner={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
