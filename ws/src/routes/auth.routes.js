const express = require('express');
const router = express.Router();
const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');

// Rota de registro
router.post('/registrar', async (req, res) => {
  const { nome, email, senha, status } = req.body;
  
  try {
    const registro = await Auth.create({
      nome,
      email,
      senha,
      status,
    });
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Rota de login (POST)
router.post('/auth', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await Auth.findOne({ where: { email } });

    if (!user || senha !== user.senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ email }, 'segredo');

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Rota para listar todas os usuarios
router.get('/read', async (req, res) => {
  try {
    const usuarios = await Auth.findAll();   
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Rota para excluir um User
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Auth.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
    }

    await user.destroy();

    res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;