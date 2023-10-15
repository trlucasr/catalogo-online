const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');
const multer = require('multer');
const path = require('path');

// Configurar o armazenamento para os uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../assets/brand/produtos'); // Especifique o caminho da pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Nomeie o arquivo com um timestamp para evitar conflitos
  },
});

const upload = multer({ storage });

// Rota para criar um novo produto com upload de imagem
router.post('/create', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, descricao, valor, categoria, status } = req.body;
    const imagem = req.file ? req.file.path : null; // Obtenha o caminho da imagem

    // Crie um novo produto no banco de dados
    const produto = await Produto.create({
      nome,
      descricao,
      valor,
      categoria,
      status,
      imagem, // Armazene o caminho da imagem no banco de dados
    });

    res.status(201).json({ mensagem: 'Inclusão realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Rota para listar todos os produtos
router.get('/read', async (req, res) => {
  try {
    // Consulte o banco de dados para obter todos os produtos
    const produtos = await Produto.findAll();

    // Mapeie os produtos para incluir informações de imagem
    const produtosComImagens = produtos.map((produto) => {
      return {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        valor: produto.valor,
        categoria: produto.categoria,
        status: produto.status,
        // Adicione o caminho da imagem (ou identificador) aqui
        imagem: produto.imagem,
      };
    });

    res.status(200).json(produtosComImagens);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
