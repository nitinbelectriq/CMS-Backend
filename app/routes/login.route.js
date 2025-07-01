const express = require('express');
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication.js");
const { checkToken } = require('../middleware/jwt');
const login = require("../controllers/login.controller.js");

// login to get token
router.post("/login", login.authorize);

module.exports = router;
