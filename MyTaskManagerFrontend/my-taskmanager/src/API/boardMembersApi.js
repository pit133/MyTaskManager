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

export async function inviteUserToBoard(boardId, invitedUserId, role) {
  const token = getToken();
  const response = await fetch(`${API_URL}/BoardMember`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      boardId: boardId,
      invitedUserId: invitedUserId,
      role: role,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }  
}