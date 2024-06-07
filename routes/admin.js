const express = require("express");
const router = express.Router();
const { Categoria, Postagem } = require("../database");

/*
router.use((req, res, next) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      categorias.map((categoria) => {
        categoria.date = categoria.date.toLocaleString("pt-br");
        return categoria;
      });
      res.locals.dropdownItems = categorias;
      next();
    })
    .catch(() => {
      res.locals.dropdownItems = [{ nome: "Nenhuma categoria", slug: "" }];
      next();
    });
});
*/

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      categorias.map((categoria) => {
        categoria.date = categoria.date.toLocaleString("pt-br");
        return categoria;
      });
      res.render("admin/categorias", { categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/admin");
      console.error(err);
    });
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategoria");
});

router.post("/categorias/nova", (req, res) => {
  let errors = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    errors.push({ text: "Nome inválido ou inexistente." });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Slug inválido ou inexistente." });
  }

  if (req.body.nome.length < 2) {
    errors.push({ text: "Nome da categoria curto." });
  }

  if (errors.length > 0) {
    res.render("admin/addcategoria", { errors });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch(() => {
        req.flash("error_msg", "Houve um erro.");
        res.redirect("/admin");
        console.error(err);
      });
  }
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .lean()
    .then((categoria) => {
      res.render("admin/editar-categoria", { categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Não encontrei esta categoria.");
      res.redirect("/admin/categorias");
      console.error(err);
    });
});

router.post("/categorias/edit", (req, res) => {
  const _id = req.body.id;
  Categoria.findOne({ _id })
    .then((categoria) => {
      let errors = [];

      if (
        !req.body.nome ||
        typeof req.body.nome == undefined ||
        req.body.nome == null
      ) {
        errors.push({ text: "Nome inválido ou inexistente." });
      }

      if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
      ) {
        errors.push({ text: "Slug inválido ou inexistente." });
      }

      if (req.body.nome.length < 2) {
        errors.push({ text: "Nome da categoria curto." });
      }

      if (errors.length > 0) {
        res.render("admin/editar-categoria", { errors });
      } else {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;
        categoria.save();

        res.redirect("/admin/categorias");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Não encontrei esta categoria.");
      res.redirect("/admin/categorias");
      console.error(err);
    });
});

router.post("/categorias/deletar", (req, res) => {
  const _id = req.body.id;
  Categoria.deleteOne({ _id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso.");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria.");
      res.redirect("/admin/categorias");
      console.error(err);
    });
});

// Postagens
router.get("/postagens", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ date: "desc" })
    .lean()
    .then((postagens) => {
      postagens.map((postagem) => {
        postagem.date = postagem.date.toLocaleString("pt-br");
        return postagem;
      });
      res.render("admin/postagens", { postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/admin");
      console.error(err);
    });
});

router.get("/postagens/add", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      categorias.map((categoria) => {
        categoria.date = categoria.date.toLocaleString("pt-br");
        return categoria;
      });
      res.render("admin/addpostagem", { categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro.");
      res.redirect("/admin");
      console.error(err);
    });
});

router.post("/postagens/nova", (req, res) => {
  let errors = [];

  if (
    !req.body.titulo ||
    typeof req.body.titulo == undefined ||
    req.body.titulo == null
  ) {
    errors.push({ text: "Título inválido." });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    errors.push({ text: "Slug inválido ou inexistente." });
  }

  if (
    !req.body.descricao ||
    typeof req.body.descricao == undefined ||
    req.body.descricao == null
  ) {
    errors.push({ text: "Descrição inválida ou inexistente." });
  }

  if (
    !req.body.conteudo ||
    typeof req.body.conteudo == undefined ||
    req.body.conteudo == null
  ) {
    errors.push({ text: "Conteúdo inválido ou inexistente." });
  }

  if (req.body.titulo.length < 2) {
    errors.push({ text: "Título da categoria curto." });
  }

  if (
    !req.body.categoria ||
    typeof req.body.categoria == undefined ||
    req.body.categoria == 0
  ) {
    errors.push({ text: "Categoria inexistente, registre uma categoria." });
  }

  if (errors.length > 0) {
    res.render("admin/addpostagem", { errors });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
    };

    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso!");
        res.redirect("/admin/postagens");
      })
      .catch(() => {
        req.flash("error_msg", "Houve um erro.");
        res.redirect("/admin");
        console.error(err);
      });
  }
});

router.get("/postagens/edit/:id", (req, res) => {
  Postagem.findOne({ _id: req.params.id })
    .lean()
    .then((postagem) => {
      Categoria.find()
        .sort({ date: "desc" })
        .lean()
        .then((categorias) => {
          res.render("admin/editar-postagem", { postagem, categorias });
        })
        .catch((err) => {
          req.flash("error_msg", "Houve um erro ao listar as categorias.");
          res.redirect("/admin/postagens");
          console.error(err);
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Não encontrei esta postagem.");
      res.redirect("/admin/postagens");
      console.error(err);
    });
});

router.post("/postagens/edit", (req, res) => {
  const _id = req.body.id;
  Postagem.findOne({ _id })
    .then((postagem) => {
      let errors = [];

      if (
        !req.body.titulo ||
        typeof req.body.titulo == undefined ||
        req.body.titulo == null
      ) {
        errors.push({ text: "Título inválido." });
      }

      if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
      ) {
        errors.push({ text: "Slug inválido ou inexistente." });
      }

      if (
        !req.body.descricao ||
        typeof req.body.descricao == undefined ||
        req.body.descricao == null
      ) {
        errors.push({ text: "Descrição inválida ou inexistente." });
      }

      if (
        !req.body.conteudo ||
        typeof req.body.conteudo == undefined ||
        req.body.conteudo == null
      ) {
        errors.push({ text: "Conteúdo inválido ou inexistente." });
      }

      if (req.body.titulo.length < 2) {
        errors.push({ text: "Título da categoria curto." });
      }

      if (
        !req.body.categoria ||
        typeof req.body.categoria == undefined ||
        req.body.categoria == 0
      ) {
        errors.push({ text: "Categoria inexistente, registre uma categoria." });
      }

      if (errors.length > 0) {
        res.render("admin/editar-postagem", { errors });
      } else {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.save();

        res.redirect("/admin/postagens");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Não encontrei esta postagem.");
      res.redirect("/admin/postagens");
      console.error(err);
    });
});

router.post("/postagens/deletar", (req, res) => {
  const _id = req.body.id;
  Postagem.deleteOne({ _id })
    .then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso.");
      res.redirect("/admin/postagens");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a postagem.");
      res.redirect("/admin/postagens");
      console.error(err);
    });
});

module.exports = router;
