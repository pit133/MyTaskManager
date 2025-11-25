import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getBoardMembers(boardId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/BoardMember/${boardId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function inviteUserToBoard(name, boardId, invitedUserId, role) {
  const token = getToken();
  const response = await fetch(`${API_URL}/BoardMember`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      boardId: boardId,
      invitedUserId: invitedUserId,
      role: role,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }  

  return await response.json();
}

export async function updateMemberRole(boardMemberId, userId, role){
  const token = getToken();
    const response = await fetch(`${API_URL}/BoardMember/${boardMemberId}/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        role: role
      }),
    });
  
    if (!response.ok) {
      throw new Error("Error");
    }
}

export async function deleteMember(memberId){
  const token = getToken();
    const response = await fetch(`${API_URL}/BoardMember/${memberId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Error");
    }
}

export async function leaveBoard(boardId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/BoardMember/leave/${boardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}