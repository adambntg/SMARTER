const pool = require("./pg_conf");
const blynk = require("./blynk_conf");
const axios = require("axios");
const { param } = require("../routes/device_route");

/* Not all VPINs are used but I want all of them here just in case */
const AUTH_TOKEN = "8MBnO3o_LjzhXp1-48BHdH4eA4lUWCg2";
const ROTATION_VPIN = 0;
const MAX_ROTATION_VPIN = 2;
const UPTIME_VPIN = 5;
const TOTAL_UPTIME_VPIN = 3;
const MAX_UPTIME_VPIN = 4;
const WATER_VOLUME_VPIN = 1;
const TOTAL_WATER_VOLUME_VPIN = 6;
const DATE_VPIN = 7;

pool.connect().then(() => {
  console.log("Connected to backend database! (Blynk)");
});

exports.run_this = async () => {
  try {
    const test = await blynk.blynk_get_api(AUTH_TOKEN, 0);
    console.log(test);
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.simple_login = async () => {
  axios
    .get("http://localhost:5000/smarter/login", {
      data: {
        username: "nahl",
        password: "root",
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
