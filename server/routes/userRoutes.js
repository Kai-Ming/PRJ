const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUser, editUser } = require("../controllers/userController");

router.post("/", registerUser);
router.patch("/", editUser);
router.post("/login", loginUser);
router.get("/profile", getUser);


module.exports = router;