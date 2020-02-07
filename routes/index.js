const express = require("express");
const router = express.Router();
const { isAuth } = require("../config/middlewareAuth");
const Puesto = require("../models/Puesto");

/* GET home page */
router.get("/", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("index", { user });
});

router.get("/home", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("home", { title: "Home", user });
});


router.get("/new", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("newPuesto", { user });
});

router.get("/profile", isAuth, (req, res, next) => {
  const { user } = req;
 let help = {};
  Puesto.find({ locatario: user._id }).then(puestos => {
    console.log(puestos);
    res.render("profile", { title: "Profile", user, puestos, help });
  });


  router.get("/card", isAuth, (req, res, next) => {
    const { user } = req;
    res.render("puestoCard", { user });
  });
});

module.exports = router;
