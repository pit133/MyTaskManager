import { useState } from "react";
import "./BoardMembersTab.css";
import {
  deleteMember,
  updateMemberRole,
} from "../../../../API/boardMembersApi";

export default function BoardMembersTab({
  members,
  currentUser,
  onUpdateMemberRole,
  onDeleteBoardMember,
}) {
  const [editingMember, setEditingMember] = useState(null);

  const canManageMembers =
    currentUser.role === "Owner" || currentUser.role === "Admin";

  async function handleUpdateMemberRole(boardMemberId, role) {
    try {
      onUpdateMemberRole(boardMemberId, role);

      await updateMemberRole(boardMemberId, currentUser.id, role);
    } catch (error) {
      console.error("Failed to update member role");
    }
  }

  async function handleDeleteMember(memberId) {
    try {
      await deleteMember(memberId);
      onDeleteBoardMember(memberId);      
    } catch (error) {
      console.error("Failed to delete member role");
    }
  }

  return (
    <div className="menu-tab-content">
      <h4>Участники доски</h4>
      <p className="menu-description">
        Управление участниками и их правами доступа
      </p>

      <div className="members-list">
        {members.map((member) => (
          <div key={member.id} className="member-item">
            <div className="member-info">
              <div className="member-avatar">
                {member.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="member-details">
                <div className="member-name">{member.name}</div>
                {/* <div className="member-email">{member.email}</div> */}
              </div>
            </div>

            {(currentUser.role === "Owner" || currentUser.role === "Admin") && (
              <div className="member-actions">
                {editingMember === member ? (
                  <div className="role-editor">
                    <select
                      value={member.role}
                      onChange={(e) => {
                        handleUpdateMemberRole(member.id, e.target.value);
                        setEditingMember(null);
                      }}
                      className="role-select"
                    >
                      {currentUser.role === "Owner" &&
                        editingMember.role === "Admin" && (
                          <>
                            {/* <option value="Owner">Owner</option> */}
                            <option value="Admin">Administrator</option>
                            <option value="Member">Member</option>
                          </>
                        )}

                      {currentUser.role === "Admin" &&
                        editingMember.role === "Member" && (
                          <>
                            <option value="Admin">Administrator</option>
                            <option value="Member">Member</option>
                          </>
                        )}

                      {currentUser.role === "Owner" &&
                        editingMember.role === "Member" && (
                          <>
                            {/* <option value="Owner">Owner</option> */}
                            <option value="Admin">Administrator</option>
                            <option value="Member">Member</option>
                          </>
                        )}
                    </select>
                    <button
                      onClick={() => setEditingMember(null)}
                      className="cancel-edit"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`member-role ${member.role.toLowerCase()}`}
                    >
                      {member.role === "Owner" && "👑"}
                      {member.role}
                    </span>

                    {canManageMembers &&
                      ((currentUser.role === "Admin" &&
                        member.role === "Member") ||
                        (currentUser.role === "Owner" &&
                          member.role === "Admin") ||
                        (currentUser.role === "Owner" &&
                          member.role === "Member")) && (
                        <div className="member-buttons">
                          <button
                            onClick={() => setEditingMember(member)}
                            className="edit-role-btn"
                            title="Изменить роль"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="remove-member-btn"
                            title="Удалить участника"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!canManageMembers && (
        <div className="permission-notice">
          Только администраторы и владелец могут управлять участниками
        </div>
      )}
    </div>
  );
}
