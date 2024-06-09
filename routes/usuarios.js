const express = require("express");
const router = express.Router();
const { Usuario } = require("../database");

router.get("/registro", (req, res) => {
  res.render("usuarios/registro");
});

module.exports = router;
