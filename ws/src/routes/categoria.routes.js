const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');

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

module.exports = router;