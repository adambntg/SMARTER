const pool = require("./pg_conf");
const blynk = require("./blynk_conf");
const axios = require("axios");
const dotenv = require("dotenv").config();
const date_fns = require("date-fns");

pool.connect().then(() => {
  console.log("Connected to backend database! (Blynk)");
});

const AUTH_TOKEN = process.env.AUTH_TOKEN;

exports.rt_synch = async () => {
  const blynk_date = await blynk.blynk_get_api(AUTH_TOKEN, {
    v7: true,
  });

  console.log(blynk_date);

  var now = null;
  var next = blynk_date;

  setInterval(async () => {
    // console.log("Consolas");
    var date = new Date();
    const format_date = date_fns.format(date, "yyyy-MM-dd");
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
      next = now;

      const PARAMS = {
        v0: 0,
        v3: 0,
        v5: 0,
        v6: 0,
        v7: now,
      };

      blynk.blynk_update_api(AUTH_TOKEN, PARAMS);
    }
  }, 2500);
};
