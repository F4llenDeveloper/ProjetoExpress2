const mongoose = require("mongoose");
const utils = require("../utils.js");

const Usuario = new mongoose.Schema({
  nome: utils.string,
  email: utils.string,
  senha: utils.string,
  date: utils.mergeOptions(utils.date, { default: Date.now() }),
});

module.exports = mongoose.model("usuario", Usuario);