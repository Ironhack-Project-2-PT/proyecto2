const express = require("express");
const router = express.Router();
cont User = require("../models/User");
const passport = require("passport");
const nodemailer = require("nodemailer");

router.get("/login", (req, res) => {
  res.render("auth-login", { action: "Login"});
});