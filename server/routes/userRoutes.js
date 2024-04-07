const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUser, editUser, changeUserCategory } = require("../controllers/userController");

const { protect } = require("../middleware/authenticationMiddleware");

router.post("/", registerUser);
router.patch("/", protect, editUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUser);
router.patch("/userCategory", protect, changeUserCategory);


module.exports = router;