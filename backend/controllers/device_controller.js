const pool = require("../models/pg_conf");
const blynk = require("../models/blynk_conf");

pool.connect().then(() => {
  console.log("Connected to backend database! (General)");
});

exports.login = async (req, res) => {
  const { username, password } = req.query;

  try {
    // Query untuk memeriksa apakah username dan password ada di tabel admin
    const result = await pool.query(
      "SELECT * FROM admin WHERE username = $1 AND password = $2",
      [username, password]
    );

    // Jika ada hasil, berarti login berhasil
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ message: "Login successful!", payload: result.rows });
    }

    return res.status(401).json({
      message: "Invalid username or password",
      payload: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.register_device = async (req, res) => {
  const { owner, auth_token } = req.query;
  // const id = 10;
  // const name = "ZENKAIII";

  try {
    const query = "INSERT INTO device VALUES ($1, $2) RETURNING *;";

    const data = [owner, auth_token];

    const response = await pool.query(query, data);

    return res.status(200).json({
      message: `Successfully registered new device!`,
      payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.get_device = async (req, res) => {
  const { auth_token } = req.query;

  try {
    const query = "SELECT * FROM device WHERE auth_token=$1";
    const data = [auth_token];
    const response = await pool.query(query, data);

    if (response.rowCount < 1) {
      return res.status(201).json({
        message: "No such device is registered!",
      });
    }

    return res.status(200).json({
      message: "Successfully retrieved device!",
      payload: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.get_all_device = async (req, res) => {
  try {
    const query = "SELECT * FROM device;";

    const response = await pool.query(query);

    return res.status(200).json({
      message: "Successfully displayed all device",
      payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.get_owned_device = async (req, res) => {
  const { owner } = req.query;

  try {
    const query = "SELECT auth_token FROM device WHERE owner=$1;";
    const data = [owner];

    const response = await pool.query(query, data);

    return res.status(200).json({
      message: `Successfully retrieved owned device for ${owner}`,
      payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.get_all_device_record = async (req, res) => {
  const { auth_token } = req.query;

  try {
    const query =
      "SELECT date, total_water_volume, total_uptime FROM history WHERE auth_token=$1";
    const data = [auth_token];

    const response = await pool.query(query, data);

    if (response.rowCount < 1) {
      return res.status(200).json({
        message: `No record from auth token ${auth_token}`,
        count: response.rowCount,
      });
    }

    return res.status(201).json({
      message: `Receive all date from auth token ${auth_token}`,
      payload: response.rows,
      count: response.rowCount,
      // date: response.rows[0].date.toISOString().split("T")[0],
      // total_uptime: response.rows[0].total_uptime,
      // total_water_volume: response.rows[0].total_water_volume,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.get_device_record = async (req, res) => {
  const { auth_token, date } = req.query;

  try {
    const query =
      "SELECT total_water_volume, total_uptime FROM history WHERE auth_token=$1 AND date=$2";
    const data = [auth_token, date];

    const response = await pool.query(query, data);

    return res.status(201).json({
      message: "Yes sir!",
      payload: response.rows,
      // total_water_volume: response.rows[0].total_water_volume,
      // total_uptime: response.rows[0].total_uptime,
      // payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.update_device_record = async (req, res) => {
  /* CHANGE THIS LATER NAHUI */
  const { auth_token } = req.query;
  const date = new Date();
  const format_date = date.toISOString().split("T")[0];

  const total_water_volume = await blynk.blynk_get_api(auth_token, 6);
  const total_uptime = await blynk.blynk_get_api(auth_token, 3);

  try {
    const query = "SELECT * FROM history WHERE date=$1 AND auth_token=$2";
    const data = [format_date, auth_token];

    const response = await pool.query(query, data);

    if (response.rowCount < 1) {
      const vrombop = "INSERT INTO history VALUES ($1, $2, $3, $4) RETURNING *";
      const zangzing = [auth_token, total_water_volume, total_uptime, date];

      const molarzing = await pool.query(vrombop, zangzing);

      return res.status(200).json({
        message: "New entry submitted!",
        payload: molarzing.rows,
      });
    }

    const new_query =
      "UPDATE history SET total_water_volume=$1, total_uptime=$2 WHERE auth_token=$3 AND date=$4 RETURNING *";
    const new_data = [
      total_water_volume,
      total_uptime,
      auth_token,
      format_date,
    ];

    const new_response = await pool.query(new_query, new_data);

    return res.status(200).json({
      message: "A record of this daten and token alreadt exist!",
      payload: new_response.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
