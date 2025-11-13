import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function findUsersByName(searchTerm) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/User/getByName/${searchTerm}`,
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

export async function findUninvitedUsersByName(boardId, searchTerm) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/User/getUninvitedUsersByName/${boardId}/${searchTerm}`,
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