const express = require("express");
const controller = require("../controllers/device_controller");
const router = express.Router();

router.get("/login", controller.login);
router.get("/register", controller.register_device);
router.get("/all", controller.get_all_device);
router.get("/owned", controller.get_owned_device);
router.get("/get", controller.get_device);
router.get("/john", controller.john);
router.get("/update_record", controller.update_device_record);
router.get("/get_record", controller.get_device_record);
router.get("/set_max", controller.set_device_max);

router.get("/say_hi", controller.say_hi);

module.exports = router;
