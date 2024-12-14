const axios = require("axios");

exports.blynk_get_api = async (AUTH_TOKEN, PIN) => {
  return axios
    .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${PIN}`)
    .then((response) => {
      // console.log(`RECEIVED V${PIN}:`, response.data);
      return response.data;
    })
    .catch((error) => {
      // console.error("Error: ", error);
      throw error;
    });
};

exports.blynk_update_api = async (AUTH_TOKEN, PIN, VALUE) => {
  return axios
    .get(
      `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${PIN}=${VALUE}`
    )
    .then((response) => {
      // console.log(`SENT V${PIN}: `, VALUE);
      return VALUE;
    })
    .catch((error) => {
      // console.error("Error: ", error);
      throw error;
    });
};

exports.blynk_batch_upate_api = async (AUTH_TOKEN, PARAMS) => {
  return axios
    .get(`http://blynk.cloud/external/api/batch/update?token=${AUTH_TOKEN}`, {
      params: {
        ...PARAMS,
      },
    })
    .then((response) => {
      // console.log("Sent: ", response.data);
      return PARAMS;
    })
    .catch((error) => {
      // console.error("Error: ", error);
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
