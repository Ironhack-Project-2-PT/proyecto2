const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploader = require("../config/cloudinary");
const Puesta = require("../models/Puesto");

isAuth = (req, res, next) => {
  if(req.isAuthenticated() && req.user.status === "confirmed") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

router.get("/", isAuth, (req, res) => {
  const { user } = req;
  Puesto.find({ owner: user._id}).then(puestos => {
    res.render("profile", { user, puestos });
  });
});

router.get("/:id/edit", isAuth, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render("profile-info", { user });
    })
    .catch(err => {
      res.render("profile-info", { err });
    });
});

router.post("/:id/edit", isAuth, uploader.single("image"), (req, res) => {
  const { id: _id } = req.params;
  const { email } = req.user;
  const image = req.file ? req.file.url : undefined;
  const user = image ? { ...req.body, image } : req.body;
  User.findOneAndUpdate({ _id, email }, { $set: user })
    .then(() => {
      res.redirect("/profile");
    })
    .catch(err => {
      res.render("profile-info", { err });
    });
});

module.exports = router;