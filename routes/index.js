const express = require('express');
const router  = express.Router();
const { isAuth } = require("../config/middlewareAuth");
const Puesto = require("../models/Puesto");

/* GET home page */
router.get('/', isAuth, (req, res, next) => {
  const { user } = req;
  res.render('index', { user });
});

router.get("/home", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("home", { title: "Home", user});
});

router.get("/profile", isAuth, (req, res, next)=> {
  const { user } = req;
  Puesto.find({})
})

module.exports = router;
