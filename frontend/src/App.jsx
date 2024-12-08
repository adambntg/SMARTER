import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import LoginPage from "./LoginPage"; // Import LoginPage component
import MainPage from "./MainPage"; // Import MainPage component
import LandingPage from "./LandingPage"; //Import LandingPage component
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Routes>
      {/* Login Page Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Landing Page Route */}
      <Route path="/landingpage" element={<LandingPage />} />

      {/* Main Page Route */}
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}

export default App;
