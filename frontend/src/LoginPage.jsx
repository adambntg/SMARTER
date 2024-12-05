import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./bak/App.css";
import logoSmartWater from "./assets/logoSmartWater.png"; // Ensure the correct logo image is available

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      axios
        .get("http://localhost:5000/smarter/login", {
          params: {
            username: username,
            password: password,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            navigate("/main");
          } else {
            setErrorMessage("Login failed. Please check your credentials.");
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setErrorMessage("An error occurred. Please try again.");
        });
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo at the top */}
        <div className="logo-container">
          <img src={logoSmartWater} alt="SmartWater Logo" className="logo" />
        </div>
        <h2>Welcome to Smart Water</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
