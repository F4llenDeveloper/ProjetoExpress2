const settings = require("../settings.json");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(settings.database_url)
.then(() => {
   console.log("Banco de Dados conectado.");
})
.catch((err) => {
   console.error(err);
});

module.exports = {
    Categoria: require("./models/Categoria"),
    Postagem: require("./models/Postagem"),
    Usuario: require("./models/Usuario"),
};