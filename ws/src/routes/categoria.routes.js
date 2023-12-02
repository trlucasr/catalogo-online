const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');
const Produto = require('../models/produto');

// Rota para criar uma nova categoria
router.post('/create', async (req, res) => {
  const { descricao, status } = req.body;

  try {
    const categoria = await Categoria.create({
      descricao,
      status,
    });
    
    res.status(201).json({ mensagem: 'Inclusão realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Rota para listar todas as categorias
router.get('/read', async (req, res) => {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  });

// Rota para obter detalhes de uma categoria por ID
router.get('/read/:id', async (req, res) => {
  const categoriaId = req.params.id;

  try {
    const categoria = await Categoria.findByPk(categoriaId);
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ error: true, message: 'Categoria não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Rota para excluir uma Categoria
router.delete('/delete/:id', async (req, res) => {
  const categoriaId = req.params.id;

  try {
    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
      return res.status(404).json({ error: true, message: 'Categoria não encontrada' });
    }

    console.log(categoria.descricao);

    const produtosVinculados = await Produto.findAll({
      where: { categoria: categoria.descricao },
    });

    if (produtosVinculados.length > 0) {
      return res.status(400).json({ error: true, mensagem: 'Não é possível excluir a categoria, pois existem produtos vinculados a ela.' });
    }
   
    await categoria.destroy();

    res.status(200).json({ mensagem: 'Categoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Rota para atualizar uma categoria
router.put('/update/:id', async (req, res) => {
  const categoriaId = req.params.id;
  const { descricao, status } = req.body;

  try {
    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
      return res.status(404).json({ error: true, message: 'Categoria não encontrada' });
    }

    categoria.descricao = descricao;
    categoria.status = status;
    await categoria.save();

    res.status(200).json({ mensagem: 'Atualização realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


module.exports = router;