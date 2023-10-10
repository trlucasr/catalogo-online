const express = require('express');
const router = express.Router();
const Auth = require('../models/auth');
const bcrypt = require('bcrypt');

router.post('/', async(req , res) => {

    try {
        const auth = await new Auth(req.body).save();
        res.json({auth});

    } catch (err) {
        res.json({ error: true, message: err.message})
    }

});

router.get('/', async (req, res) => {

  });
  

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Auth.findOne({ where: { email } });

    if (!usuario) {
      return res.json({ error: true, message: 'Email não encontrado' });
    }

    const senhaCorrespondente = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorrespondente) {
      return res.json({ error: true, message: 'Senha incorreta' });
    }

    // Se a autenticação for bem-sucedida, você pode fazer outras ações aqui

    res.json({ success: true, message: 'Autenticação bem-sucedida' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;