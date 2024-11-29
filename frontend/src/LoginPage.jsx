import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Untuk redirect ke halaman utama setelah login berhasil

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Menyimpan pesan error jika login gagal
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk menangani login
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload page

    try {
      // Mengirim data username dan password ke backend API
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Kirim data login
      });

      // Jika login berhasil
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Login berhasil
        navigate("/main"); // Arahkan ke halaman utama setelah login berhasil
      } else {
        const data = await response.json();
        setErrorMessage(data.message); // Menampilkan pesan error jika login gagal
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
