const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Categoria = sequelize.define('Categoria', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  status: {
    type: DataTypes.ENUM('A', 'I', 'E'),
    defaultValue: 'A',
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Tabela Categoria sincronizada com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar tabela com o banco de dados:', error);
  }
})();

module.exports = Categoria;