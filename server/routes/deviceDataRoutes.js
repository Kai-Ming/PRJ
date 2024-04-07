const express = require("express");
const router = express.Router();

const { createDeviceData, getDeviceData } = require("../controllers/deviceDataController");

const { protect } = require("../middleware/authenticationMiddleware");

router.post("/", protect, createDeviceData);
router.get("/deviceData", protect, getDeviceData);

module.exports = router;