const express = require("express");

const userController = require("../controllers/user");

const auth = require("../middleware/authentification");

//importation du middleware password après définition du passwordSchema

const limiter = require("../middleware/limiter");

const router = express.Router();

router.post("/signup", password, userController.signUp);
router.post("/login", limiter.loginLimiter, userController.login);

module.exports = router;
