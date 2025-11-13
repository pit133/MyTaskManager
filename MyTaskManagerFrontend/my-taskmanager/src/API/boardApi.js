import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getBoardsNames() {
  const token = getToken();
  const response = await fetch(`${API_URL}/Board/ownedBoards`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}



export async function createBoard(name) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Board`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,      
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function getMembershipBoards() {
  const token = getToken();
  const response = await fetch(`${API_URL}/Board/memberships`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}