const express = require("express");
const router = express.Router();

const { getAllUsers, createUser, loginUser } = require("../controllers/userController");

// get all users
router.get("/", getAllUsers);

// create user
router.post("/", createUser);

// login user
router.post("/login", loginUser);

module.exports = router;
