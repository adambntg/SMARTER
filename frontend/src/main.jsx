import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Untuk routing
import App from "./App"; // Mengimpor App dari src
import "./App.css"; // Import CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* Membungkus dengan BrowserRouter untuk routing */}
    <App />
  </BrowserRouter>
);
