import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Untuk redirect ke halaman utama setelah login berhasil
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Menyimpan pesan error jika login gagal
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk menangani login
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah reload page

    // Mengirim data username dan password ke backend API
    axios
      .get("http://localhost:5000/smarter/login", {
        params: { username: "nahl", password: "root" },
      })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
