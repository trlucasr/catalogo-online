const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../assets/brand/produtos'); 
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); 
  },
});

const upload = multer({ storage });

router.post('/create', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, descricao, valor, categoria, status } = req.body;
    const imagem = req.file ? req.file.path : null; 

    const produto = await Produto.create({
      nome,
      descricao,
      valor,
      categoria,
      status,
      imagem, 
    });

    res.status(201).json({ mensagem: 'Inclusão realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/read', async (req, res) => {
  try {
    
    const produtos = await Produto.findAll();
 
    const produtosComImagens = produtos.map((produto) => {
      return {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        valor: produto.valor,
        categoria: produto.categoria,
        status: produto.status, 
        imagem: produto.imagem,
      };
    });

    res.status(200).json(produtosComImagens);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/read/:id', async (req, res) => {
  const produtoId = req.params.id;

  try {
    const produto = await Produto.findByPk(produtoId);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ error: true, message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const produto = await Produto.findByPk(productId);

    if (!produto) {
      return res.status(404).json({ error: true, message: 'Produto não encontrado' });
    }

    
    await produto.destroy();

    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


// Rota para atualizar uma Produto
router.put('/update/:id', upload.single('imagem'), async (req, res) => {
  const produtoId = req.params.id;
  const { nome, descricao, valor, categoria } = req.body;
  const imagem = req.file ? req.file.path : null; 

  try {
    const produto = await Produto.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({ error: true, message: 'Produto não encontrado' });
    }

    produto.nome = nome;
    produto.descricao = descricao;
    produto.valor = valor;
    produto.categoria = categoria;    
    //produto.imagem = imagem;    

    if (imagem) {
      produto.imagem = imagem;
    }

    await produto.save();

    res.status(200).json({ mensagem: 'Atualização realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
