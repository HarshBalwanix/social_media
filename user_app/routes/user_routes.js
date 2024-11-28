const express = require("express");

const {
  createUser,
  loginUser,
  getAllusers,
  getUser,
} = require("../controllers/user_controller");

const router = express.Router();

//user routes
router.get("/users", getAllusers);
router.get("/users/:username", getUser);
router.post("/users", createUser);
router.post("/users/login", loginUser);

module.exports = router;

// node module delete
// npm install
