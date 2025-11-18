import { getToken } from './authApi';

const API_URL = "http://localhost:5002/api";

export async function getTaskCheckListItems(taskCheckListId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/TaskCheckListItem/by-TaskCheckList/${taskCheckListId}`,
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

export async function updateTaskCheckListItem(checkListItemId, title) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/TaskCheckListItem/Update/${checkListItemId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function changeCheckListItemIsComplete(taskCheckListItemId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/TaskCheckListItem/Completed/${taskCheckListItemId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function deleteTaskCheckListItem(taskCheckListItemId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/TaskCheckListItem/${taskCheckListItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function addCheckListItem(taskCheckListId, title) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskCheckListItem`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskCheckListId: taskCheckListId,
      title: title,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}