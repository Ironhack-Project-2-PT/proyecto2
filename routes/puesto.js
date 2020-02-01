const express = require("express");
const router = express.Router();
const Puesto = require("../models/Puesto");
const uploader = require("../config/cloudinary");

isAuth = (req, res, next) => {
  if(req.isAuthenticated() && req.user.status === "confirm") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

router.get("/", (req, res) => {
  const { user } = req;
  Puesto.find()
  .limit(12)
  .then(puestos => {
    res.render("puestos", { puestos, user });
  });
});

router.get("/json", (req, res) => {
  Puesto.find()
  .limit(14)
  .then(puestos => {
    res.status(200).json({ puestos});
  });
});

router.get(":id/edit" , (req, res) => {
  const { id} = req.params;
  const { user } = req;
  Puesto.findById(id).then(puesto => {
    res.render("new-puesto", { user, puesto });
  });
});

router.post("/:id/edit", isAuth, uploader.array("images"), (req, res) => {
  const { id } = req.params;
  const { lat, lng, address, ...puesto } = req.body;
  let location = { address, coordinates: [lat, lng] };
  Property.findByIdAndUpdate(id, { $set: { ...property, location } }).then(
    () => {
      res.redirect("/puestos");
    }
  );
});

router.get("/new", isAuth, (req, res) => {
  const { user } = req;
  res.render("new-puesto", { user });
});

router.post("/new", isAuth, uploader.array("images"), (req, res) => {
  let images = req.files.map(file => file.url);
  let { _id: owner } = req.user;
  let { lat, lng, address, ...puesto } = req.body;
  let location = { address, coordinates: [lat, lng] };
  puesto = { ...puesto, images, owner, location };
  Puesto.create(puesto)
    .then(() => {
      res.redirect("/profile");
    })
    .catch(err => {
      res.render("new-puesto", { err });
    });
});

module.exports = router;
