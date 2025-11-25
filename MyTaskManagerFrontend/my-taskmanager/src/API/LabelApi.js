import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getBoardLabels(boardId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Label/board-labels/${boardId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function getTaskLabels(taskId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskLabel/${taskId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}