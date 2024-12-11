import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage"; // Import LoginPage component
import MainPage from "./MainPage"; // Import MainPage component
import LandingPage from "./LandingPage"; //Import LandingPage component
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/landing"} replace={true} />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/landing" element={<LandingPage />} />

      <Route path="/main" element={<MainPage />} />

      <Route path="*" element={<Navigate to="/landing" replace={true} />} />
    </Routes>
  );
}

export default App;
