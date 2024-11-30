const axios = require("axios");

// Blynk LMAO
const AUTH_TOKEN = "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I";
const GET_PIN = 0; // Example virtual pin
const POST_PIN = 2;

const val = 135;

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
      `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${POST_PIN}=${val}`
    )
    .then((response) => {
      console.log("Data sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending data to Blynk:", error);
    });
};

module.exports = { blynkGet, blynkUpdate };
