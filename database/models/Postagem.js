const mongoose = require("mongoose");
const utils = require("../utils.js");

const Postagem = new mongoose.Schema({
  titulo: utils.string,
  slug: utils.string,
  descricao: utils.string,
  conteudo: utils.string,
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoria",
    required: true,
  },
  date: utils.mergeOptions(utils.date, { default: Date.now() }),
});

module.exports = mongoose.model("postagem", Postagem);