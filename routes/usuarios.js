const express = require("express");
const router = express.Router();
const { Usuario } = require("../database");

router.get("/registro", (req, res) => {
  res.render("usuarios/registro");
});

router.post("/registro", (req, res) => {
  let errors = [];

  if (!req.body.nome) errors.push({ text: `Você deve informar seu nome.` });
  if (!req.body.email) errors.push({ text: `Você deve informar seu email.` });
  if (!req.body.senha) errors.push({ text: `Você deve informar sua senha.` });
  if (req.body.senha.length < 8)
    errors.push({ text: `Sua senha deve conter mais de 8 dígitos.` });
  if (!req.body.senha2) errors.push({ text: `Você deve confirmar sua senha.` });
  if (req.body.senha != req.body.senha2)
    errors.push({ text: `As senhas não correspondem.` });

  if (errors.length > 0) {
    
    res.render("usuarios/registro", { errors });
  } else {
    res.render("/");
  }
});

module.exports = router;
