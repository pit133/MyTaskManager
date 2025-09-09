import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BoardsPage from "./pages/BoardsPage"
import BoardPage from "./pages/BoardPage";
import { getToken } from "./api";

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
