const axios = require("axios");

// Blynk LMAO
// const AUTH_TOKEN = "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I";
// const GET_PIN = 0; // Example virtual pin
// const POST_PIN = 2;

// const val = 135;

exports.blynk_get_api = (AUTH_TOKEN, PIN) => {
  return axios
    .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${PIN}`)
    .then((response) => {
      console.log("Received: ", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error: ", error);
      throw error;
    });
};

exports.blynk_update_api = (AUTH_TOKEN, PIN, VALUE) => {
  return axios
    .get(
      `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${PIN}=${VALUE}`
    )
    .then((response) => {
      console.log("Sent: ", VALUE);
      return VALUE;
    })
    .catch((error) => {
      console.error("Error: ", error);
      throw error;
    });
};

// const blynkGet = () => {
//   axios
//     .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${GET_PIN}`)
//     .then((response) => {
//       console.log("Received data from virtual pin:", response.data);
//     })
//     .catch((error) => {
//       console.error("Error reading data from Blynk:", error);
//     });
// };

// const blynkUpdate = () => {
// axios
//   .get(
//     `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${POST_PIN}=${val}`
//   )
//   .then((response) => {
//     console.log("Data sent successfully:", response.data);
//   })
//   .catch((error) => {
//     console.error("Error sending data to Blynk:", error);
//   });
// };

// module.exports = { blynkGet, blynkUpdate };
