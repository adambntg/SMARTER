import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import LoginPage from "./LoginPage"; // Import LoginPage component
import MainPage from "./MainPage"; // Import MainPage component
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Login Page Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Main Page Route */}
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}

export default App;
