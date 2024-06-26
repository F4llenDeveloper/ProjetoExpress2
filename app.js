const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { engine, registerHelper } = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const { Categoria, Postagem } = require("./database");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/usuarios");

app.use(
  session({
    secret: "30@15#01!14",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);

app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");

  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      if (!categorias || categorias.length < 1) {
        res.locals.categorias = [{ nome: "Nenhuma categoria", slug: "/" }];
      } else {
        categorias.map((categoria) => {
          categoria.date = categoria.date.toLocaleString("pt-br");
          return categoria;
        });
        res.locals.categorias = categorias;
      }

      next();
    })
    .catch(() => {
      res.locals.categorias = [{ nome: "Nenhuma categoria", slug: "/" }];
      next();
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", engine());

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ date: "desc" })
    .lean()
    .then((postagens) => {
      postagens.map((postagem) => {
        postagem.date = postagem.date.toLocaleString("pt-br");
        return postagem;
      });
      res.render("index", { postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/404");
      console.error(err);
    });
});

app.get("/postagem/:slug", (req, res) => {
  const { slug } = req.params;
  Postagem.findOne({ slug })
    .lean()
    .then((postagem) => {
      if (postagem) {
        postagem.date = postagem.date.toLocaleString("pt-br");
        res.render("postagem/index", { postagem });
      } else {
        req.flash(
          "error_msg",
          "Esta postagem não existe, recarregue a página."
        );
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/");
      console.error(err);
    });
});

app.get("/categoria/:slug", (req, res) => {
  const { slug } = req.params;
  Categoria.findOne({ slug })
    .lean()
    .then((categoria) => {
      if (categoria) {
        categoria.date = categoria.date.toLocaleString("pt-br");
        Postagem.find({ categoria: categoria._id })
          .sort({ date: "desc" })
          .lean()
          .then((postagens) => {
            postagens.map((postagem) => {
              postagem.date = postagem.date.toLocaleString("pt-br");
              return postagem;
            });
            res.render("categorias/postagens", { postagens, categoria });
          })
          .catch((err) => {
            req.flash("error_msg", "Houve um erro.");
            res.redirect("/");
            console.error(err);
          });
      } else {
        req.flash("error_msg", "Esta categoria não existe.");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/");
      console.error(err);
    });
});

app.use("/admin", adminRouter);
app.use("/usuarios", usersRouter);

app.get("/404", (req, res) => {
  res.send("Erro 404");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor iniciado! Porta ${port}`);
});