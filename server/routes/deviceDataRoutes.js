const express = require("express");
const router = express.Router();

const { createDeviceData, getDeviceData } = require("../controllers/deviceDataController");

router.post("/", createDeviceData);

router.get("/deviceData", getDeviceData);

module.exports = router;