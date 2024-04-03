const express = require("express");
const router = express.Router();

const { createDevice, getDevices } = require("../controllers/deviceController");

router.post("/", createDevice);
router.patch("/devices", getDevices);

module.exports = router;