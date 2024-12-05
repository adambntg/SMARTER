const pool = require("./pg_conf");
const blynk = require("./blynk_conf");
const axios = require("axios");
const dotenv = require("dotenv").config();

/* Not all VPINs are used but I want all of them here just in case */
const AUTH_TOKEN = process.env.AUTH_TOKEN;

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

exports.rt_update_record = async () => {
  axios
    .get("http://localhost:5000/smarter/update_record", {
      params: {
        auth_token: AUTH_TOKEN,
      },
    })
    .then((response) => {})
    .catch((error) => {
      console.error(error.message);
    });
};

exports.rt_get_record = async () => {
  axios
    .get("http://localhost:5000/smarter/get_record", {
      params: {
        auth_token: AUTH_TOKEN,
      },
    })
    .then((response) => {
      console.log(
        `TWV: ${response.data.total_water_volume} TU:${response.data.total_uptime}`
      );
    })
    .catch((error) => {
      console.error(error.message);
    });
};

exports.simple_login = async () => {
  axios
    .get("http://localhost:5000/smarter/login", {
      params: {
        username: "nahl",
        password: "root",
      },
    })
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      console.log(error.message);
    });
};
