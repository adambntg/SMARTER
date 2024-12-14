const pool = require("./pg_conf");
const blynk = require("./blynk_conf");
const axios = require("axios");
const dotenv = require("dotenv").config();

/* Not all VPINs are used but I want all of them here just in case */
pool.connect().then(() => {
  console.log("Connected to backend database! (Blynk)");
});

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const DATE_VPIN = 7;

var now = null;
var next = null;

exports.rt_synch = async () => {
  next = await blynk.blynk_get_api(AUTH_TOKEN, DATE_VPIN);

  setInterval(async () => {
    // console.log("Consolas");
    var date = new Date();
    var format_date = date.toISOString().split("T")[0];
    now = format_date;

    await axios
      .get(`http://localhost:5000/smarter/update_record`, {
        params: {
          auth_token: AUTH_TOKEN,
        },
      })
      .then((response) => {
        const res = response.data;
        // console.log(res.message);
        // console.log(res.payload);
      })
      .catch((error) => {
        console.log(error);
      });

    if (now != next) {
      console.log("Date has changed!");
      await blynk.blynk_update_api(AUTH_TOKEN, DATE_VPIN, now);
      next = now;

      const PARAMS = {
        v0: 0,
        v3: 0,
        v5: 0,
        v6: 0,
      };

      await blynk.blynk_batch_upate_api(AUTH_TOKEN, PARAMS);
    }
  }, 1000);
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
