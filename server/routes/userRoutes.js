const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUser, editUser, changeUserCategory } = require("../controllers/userController");

router.post("/", registerUser);
router.patch("/", editUser);
router.post("/login", loginUser);
router.get("/profile", getUser);
router.get("/userCategory", changeUserCategory);


module.exports = router;