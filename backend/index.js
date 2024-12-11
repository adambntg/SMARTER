const express = require("express");
const cors = require("cors");
const device_route = require("./routes/device_route");
const rt = require("./models/rt_conf");
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

/** PLEASE ENABLE THIS LATER */
// rt.rt_synch();

app.use("/smarter", device_route);

console.log(process.env.AUTH_TOKEN);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/** For deploymeny */
// export default app;
