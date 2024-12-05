const axios = require("axios");
const blynk = require("./blynk_conf");

const DATE_VPIN = 7;
const AUTH_TOKEN = "8MBnO3o_LjzhXp1-48BHdH4eA4lUWCg2";

var now = null;
var next = null;

axios
  .get(`https://blynk.cloud/external/api/get?token=${AUTH_TOKEN}&v${DATE_VPIN}`)
  .then((response) => {
    console.log("Received: ", response.data);
    next = response.data;
  })
  .catch((error) => {
    console.error("Error: ", error);
  });

exports.date_determine = () => {
  const date = new Date();
  const format_date = date.toISOString().split("T")[0];
  now = format_date;

  console.log(now);
  console.log(next);

  if (now != next) {
    console.log("Date change detected!");
    next = format_date;
    axios
      .get(
        `https://blynk.cloud/external/api/update?token=${AUTH_TOKEN}&v${DATE_VPIN}=${next}`
      )
      .then((response) => {
        console.log("Sent: ", next);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const params = {
      v0: 0,
      v3: 0,
      v5: 0,
      v6: 0,
    };

    axios
      .get(`http://blynk.cloud/external/api/batch/update?token=${AUTH_TOKEN}`, {
        params,
      })
      .then((response) => {
        console.log("Sent: ", response.data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  } else {
    // console.log("No date change!");
  }
};
