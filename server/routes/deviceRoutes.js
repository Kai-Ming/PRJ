const express = require("express");
const router = express.Router();

const { createDevice, getDevices } = require("../controllers/deviceController");

const { protect } = require("../middleware/authenticationMiddleware");

router.post("/", protect, createDevice);
router.get("/devices", protect, getDevices);

module.exports = router;