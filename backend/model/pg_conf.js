// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "Kel_7",
  host: "ep-tiny-morning-a54udmwa.us-east-2.aws.neon.tech",
  database: "RPL",
  password: "8UPolS6zQBmh",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
