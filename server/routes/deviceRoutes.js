const express = require("express");
const router = express.Router();

const { createDevice, changeDevicePermisssions } = require("../controllers/deviceController");

router.post("/", createDevice);
router.patch("/:id", changeDevicePermisssions);

module.exports = router;