import { useState } from "react";
import { findUninvitedUsersByName } from "../../../API/userApi";
import { inviteUserToBoard } from "../../../API/boardMembersApi";
import "./InviteModal.css";

export default function InviteModal({ boardId, onClosed, onUserInvited }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Member");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [userAdded, setUserAdded] = useState(false);
  const [inviting, setInviting] = useState(false);

  function closeInviteModal() {
    onClosed();
  }

  async function handleSearchUsers() {
    try {
      setSearching(true);
      setError("");
      const results = await findUninvitedUsersByName(boardId, searchTerm);
      setSearchResults(results || []);
    } catch (error) {
      console.error(error);
      setError("Failed to search users");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function handleInviteUser(user) {
    try {
      setInviting(true);      
      const invitedUser = await inviteUserToBoard(user.name, boardId, user.id, selectedRole);              
      if (invitedUser.role === 0) {
          invitedUser.role = "Owner";
        }

        if (invitedUser.role === 1) {
          invitedUser.role = "Admin";
        }

        if (invitedUser.role === 2) {
          invitedUser.role = "Member";
        }
      onUserInvited(invitedUser);      
      
    } catch (error) {
      console.error("Failed to invite user to board: " + error);
      setError("Failed to invite user");
    } finally {
      setInviting(false);
      setUserAdded(true);
    }
  }

  return (
    <div className="invite-modal" onClick={closeInviteModal}>
      <div
        className="invite-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="invite-modal-header">
          <h2 className="invite-modal-title">Invite to Board</h2>
          <button className="close-btn" onClick={closeInviteModal}>
            ×
          </button>
        </div>

        <div className="invite-modal-body">
          <div className="user-search-form">
            <div className="search-input-group">
              <input
                type="text"
                className="user-search-input"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearchUsers()
                  setUserAdded(false);
                }}
                // onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}            
              />
              <select
                className="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* <button
              className="search-btn"
              onClick={handleSearchUsers}
              disabled={searching || !searchTerm.trim()}
            >
              {searching ? "Searching..." : "Search"}
            </button> */}

            {searching && (
              <div className="loading-search">Searching users...</div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="user-result"
                    onClick={() => handleInviteUser(user)}
                  >
                    <div className="user-avatar">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      {/* <div className="user-email">{user.email}</div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchTerm && !searching && (
              <div className="empty-search">
                No users found matching "{searchTerm}"
              </div>
            )}

            {error && (
              <div className="error-message" style={{ margin: 0 }}>
                {error}
              </div>
            )}

            {userAdded ? (
              <div className="user-added-message" style={{ margin: 0 }}>
                user added
              </div>
            ) : (
              <></>
            )}

            <div className="invite-actions">
              <button
                className="cancel-invite-btn"
                onClick={closeInviteModal}
                disabled={inviting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
