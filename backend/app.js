const express = require("express");
const cors = require("cors");
const device_route = require("./routes/device_route");
const date_test = require("./models/date_conf");
const made_in_heaven = require("./models/made_in_heaven");
const controller = require("./controllers/device_controller");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: "GET, POST, PUT, DELETE",
  })
);
// app.use(express.static(path.join(__dirname, "../frontend"))); // Menyajikan file statis dari folder frontend

// setInterval(date_test.date_determine, 1000);
// setInterval(made_in_heaven.rt_update_record, 100);
// setInterval(made_in_heaven.rt_get_record, 1000);

app.use("/smarter", device_route);

console.log(process.env.AUTH_TOKEN);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
