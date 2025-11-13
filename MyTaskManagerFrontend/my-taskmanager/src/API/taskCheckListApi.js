import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getTaskCheckLists(taskItemId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/TaskCheckList/by-task/${taskItemId}`,
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

export async function createTaskCheckList(taskItemId, title) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskCheckList`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskItemId: taskItemId,
      title: title,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function deleteTaskCheckList(taskCheckListId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskCheckList/${taskCheckListId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function updateTaskCheckList(taskCheckListId, title) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskCheckList/${taskCheckListId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}