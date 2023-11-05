const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('A', 'I', 'E'),
    defaultValue: 'A',
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Tabela Produto sincronizada com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar tabela com o banco de dados:', error);
  }
})();

module.exports = Produto;