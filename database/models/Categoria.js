const mongoose = require("mongoose");
const utils = require("../utils.js");

const Categoria = new mongoose.Schema({
  nome: utils.string,
  slug: utils.string,
  date: utils.mergeOptions(utils.date, { default: Date.now() }),
});

module.exports = mongoose.model("categoria", Categoria);