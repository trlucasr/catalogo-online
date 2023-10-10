const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');

const Auth = sequelize.define('Auth', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING, 
    allowNull: false,
    set(value) {      
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('senha', hashedPassword);
    },
  },
  status: {
    type: DataTypes.ENUM('A', 'I', 'E'),
    defaultValue: 'A',
  },
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Tabela Autenticacao sincronizada com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar tabela com o banco de dados:', error);
  }
})();

module.exports = Auth;