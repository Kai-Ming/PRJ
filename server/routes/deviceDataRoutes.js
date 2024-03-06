const express = require("express");
const router = express.Router();

const { createDeviceData, getDeviceData } = require("../controllers/deviceDataController");

router.post("/", createDeviceData);

router.get("/:id", getDeviceData);

module.exports = router;