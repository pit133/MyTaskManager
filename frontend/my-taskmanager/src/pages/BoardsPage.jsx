import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBoardsNames, getToken } from "../api";

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadBoards() {
      try {
        setLoading(true);    
        const data = await getBoardsNames();        
        setBoards(data);
      } 
      catch (err) {
        setError("Failed to load boards");
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }  
    loadBoards();
  }, [navigate]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Boards</h1>
      {boards.length === 0 ? (
        <p>No boards yet</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li
              key={board.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              {board.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}