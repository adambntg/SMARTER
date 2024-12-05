const pool = require("../models/pg_conf");

pool.connect().then(() => {
  console.log("Connected to backend database! (General)");
});

exports.login = async (req, res) => {
  const { username, password } = req.body;

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
        .json({ message: "Login successful!", payload: response.rows });
    }

    return res.status(401).json({
      message: "Invalid username or password",
      payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

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

exports.john = async (req, res) => {
  // const { data } = req.body;

  try {
    const query = "INSERT INTO date_test VALUES ($1) RETURNING *;";
    const date = new Date();
    const data = [date];

    const response = await pool.query(query, data);

    return res.status(200).json({
      message: "Yep all done!",
      payload: response.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.record_device = async (req, res) => {
  const { auth_token } = req.body;
  const date = new Date();
  const format_date = date.toISOString().split("T")[0];

  try {
    const query = "SELECT * FROM history WHERE date=$1 AND auth_token=$2";
    const data = [format_date, auth_token];

    const response = await pool.query(query, data);

    if (response.rowCount < 1) {
      return res.status(401).json({
        message: "Not exist!",
      });
    }

    return res.status(200).json({ message: "Exist!", payload: response.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
