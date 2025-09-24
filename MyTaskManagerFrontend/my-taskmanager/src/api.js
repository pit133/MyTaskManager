const API_URL = "http://localhost:5002/api";

export async function login(name, password) {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json();
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getBoardsNames() {
  const token = getToken();
  const response = await fetch(`${API_URL}/Board`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

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

export async function getTasks(columnId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskItem/by-column/${columnId}`, {
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
      title: columnTitle
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function addTask(columnId, title, description) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskItem`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      columnId: columnId,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  return await response.json();
}

export async function deleteTask(taskItemId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskItem/${taskItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function updateTask(taskItemId, title, description) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskItem/${taskItemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}

export async function moveTask(taskId, newColumnId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/TaskItem/${taskId}/move/${newColumnId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      //"Content-Type": "application/json",
    },
    //body: JSON.stringify({taskId, newColumnId})
  });

  if (!response.ok) {
    throw new Error("Error");
  }
}
