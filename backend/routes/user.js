const express = require("express");
const router = express.Router();

const { login, dashboard, getAllUsers, editProfile, deleteUser,getSingle } = require("../controllers/user");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);

router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/users/:userId").put(editProfile); 
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId").get(getSingle); 
module.exports = router;
