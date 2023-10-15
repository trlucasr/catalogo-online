const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const hostname = 'localhost'; // Defina o hostname para localhost
const port = 8000; // Defina a porta para 8000

app.use('/login', require('./routes/auth.routes'));
app.use('/produtos', require('./routes/produto.routes'));
app.use('/categorias', require('./routes/categoria.routes'));

app.listen(port, hostname, () => {
  console.log(`Servidor está rodando em http://${hostname}:${port}`);
});