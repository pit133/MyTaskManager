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
  const response = await fetch(`${API_URL}/Label/task-labels/${taskId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function addBoardLabel(boardId, label) {
 const token = getToken();
   const response = await fetch(`${API_URL}/Label/board-label/${boardId}`, {
     method: "POST",
     headers: {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       title: label.title,
       color: label.color,      
     }),
   });
 
   if (!response.ok) {
     throw new Error("Error");
   }
 
   return await response.json(); 
}

export async function addTaskLabel(taskId, labelId) {
 const token = getToken();
   const response = await fetch(`${API_URL}/Label/task-label/${taskId}/${labelId}`, {
     method: "POST",
     headers: {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
     }     
   });
 
   if (!response.ok) {
     throw new Error("Error");
   }    
}

export async function deleteTaskLabel(taskId, labelId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Label/delete-label-from-task/${taskId}/${labelId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function deleteBoardLabel(labelId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/Label/delete-board-label/${labelId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}
