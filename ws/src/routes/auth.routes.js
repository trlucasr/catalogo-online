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
      senha, // Neste caso, você deve armazenar a senha em texto simples
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

    // Você pode comparar a senha em texto simples
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

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Auth = require('../models/auth');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Rota de registro
// router.post('/registrar', async (req, res) => {
//   const { nome, email, senha, status } = req.body;
//   const hashedPassword = await bcrypt.hash(senha, 10);
  
//   try {
//     const registro = await Auth.create({
//       nome,
//       email,
//       senha: hashedPassword,
//       status,
//     });
//     res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
//   } catch (err) {
//     res.status(500).json({ error: true, message: err.message });
//   }
// });

// // Rota de login (POST)
// router.post('/auth', async (req, res) => {
//   const { email, senha } = req.body;

//   try {
//     const user = await Auth.findOne({ where: { email } });

//     if (!user || !await bcrypt.compare(senha, user.senha)) {
//       return res.status(401).json({ error: 'Credenciais inválidas' });
//     }

//     const token = jwt.sign({ email }, 'segredo');

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: true, message: err.message });
//   }
// });

// // Rota para listar todas os usuarios
// router.get('/read', async (req, res) => {
//   try {
//     const usuarios = await Auth.findAll();
//     res.json(usuarios);
//   } catch (error) {
//     res.status(500).json({ error: true, message: error.message });
//   }
// });

// module.exports = router;