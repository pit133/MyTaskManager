import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import BoardsPage from "./pages/BoardsPage/BoardsPage"
import BoardPage from "./pages/BoardPage/BoardPage";
import { getToken } from "./API/authApi";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element ={<LoginPage/>}/>
        <Route path="/boards" 
        element={getToken() ? <BoardsPage /> : console.log("error")}/>
        <Route path="boards/:id" element={<BoardPage/>}></Route>                
        <Route path="/" element={<Navigate to="/login"/>}/>        
      </Routes>
    </Router>
  );
}

export default App;
