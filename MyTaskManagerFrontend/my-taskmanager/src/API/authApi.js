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

  const data = await response.json();
  console.log("Login API response:", data);
  console.log("Response structure:", Object.keys(data));
  saveCurrentUserData(data)
  return data
}

export function saveCurrentUserData(currentUserData) {
  localStorage.setItem("token", currentUserData.token.token);
  localStorage.setItem("userId", currentUserData.token.userId)
  localStorage.setItem("userName", currentUserData.token.userName)
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUserId(){
  return localStorage.getItem("userId")
}

export function getCurrentUserName(){
  return localStorage.getItem("userName")
}