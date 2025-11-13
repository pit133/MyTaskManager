import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getColumns(boardId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Column/by-board/${boardId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function addColumn(boardId, newColumnName) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Column`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newColumnName,
      boardId: boardId,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function deleteColumn(columnId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Column/${columnId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function updateColumn(columnId, columnTitle) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Column/${columnId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: columnTitle,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}