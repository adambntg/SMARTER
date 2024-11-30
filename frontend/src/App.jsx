import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import LoginPage from "./LoginPage"; // Import komponen LoginPage

/*
const axios = require("axios");

// Blynk LMAO

const blynkGet = () => {
  axios
    .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${GET_PIN}`)
    .then((response) => {
      console.log("Received data from virtual pin:", response.data);
    })
    .catch((error) => {
      console.error("Error reading data from Blynk:", error);
    });
};

const blynkUpdate = () => {
  axios
    .get(
      `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${POST_PIN}=${valueToSend}`
    )
    .then((response) => {
      console.log("Data sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending data to Blynk:", error);
    });
};

module.exports = { blynkGet, blynkUpdate };

*/

function App() {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [getVal, setGetVal] = useState(0); // Untuk data Blynk
  const navigate = useNavigate(); // Hook untuk navigasi

  const AUTH_TOKEN = "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I";
  const GET_PIN = 0; // Virtual pin untuk membaca data dari Blynk

  // Fungsi untuk mengambil data dari Blynk API
  const blynkGet = async () => {
    try {
      const response = await axios.get(
        `https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${GET_PIN}`
      );
      setGetVal(response.data); // Mengupdate state dengan data dari Blynk
    } catch (error) {
      console.error("Error reading data from Blynk:", error);
    }
  };

  // Mengupdate data setiap interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(Math.random() * 40); // Update temperatur setiap 5 detik
      setHumidity(Math.random() * 100); // Update kelembaban setiap 5 detik
    }, 5000);

    // Mengambil data dari Blynk setiap detik
    const blynkInterval = setInterval(blynkGet, 1000);

    return () => {
      clearInterval(interval); // Membersihkan interval ketika komponen unmount
      clearInterval(blynkInterval); // Membersihkan interval Blynk
    };
  }, []); // Run only once when component mounts

  return (
    <Routes>
      {/* Rute untuk halaman login */}
      <Route path="/" element={<LoginPage />} />

      {/* Rute untuk halaman utama */}
      <Route
        path="/main"
        element={
          <div className="min-h-screen bg-gray-100 p-8">
            <p className="font-mono">TEST</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Temperature</h3>
                <CircularProgressbar
                  value={temperature}
                  maxValue={40}
                  text={`${temperature.toFixed(2)}°C`}
                  styles={{
                    path: { stroke: "rgb(250, 100, 100)" },
                    text: { fill: "#333", fontSize: "16px" },
                  }}
                  strokeWidth={6}
                />
              </div>

              {/* Humidity */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Humidity</h3>
                <CircularProgressbar
                  value={humidity}
                  maxValue={100}
                  text={`${humidity.toFixed(2)}%`}
                  styles={{
                    path: { stroke: "rgb(100, 150, 255)" },
                    text: { fill: "#333", fontSize: "16px" },
                  }}
                  strokeWidth={6}
                />
              </div>

              {/* Servo Rotation */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-sans mb-2">Rotasi Servo</p>
                <CircularProgressbar
                  value={getVal}
                  maxValue={180}
                  text={`${getVal}`}
                  styles={{
                    path: { stroke: "rgb(100, 255, 100)" },
                    text: { fill: "#333", fontSize: "10px" },
                  }}
                  strokeWidth={6}
                />
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
