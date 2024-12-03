const pool = require("../models/pg_conf");

pool.connect().then(() => {
  console.log("Connected to backend database!");
});

exports.register_device = async (req, res) => {
  const { owner, auth_token } = req.body;
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
  const { auth_token } = req.body;

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
  const { owner } = req.body;

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

