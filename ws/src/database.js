const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'seven',
  password: 'YPlBSFVar4KQQk4h',
  database: 'catalogo',
  define: {
    timestamps: true,
  },
});

module.exports = sequelize; // Exporte a instância do sequelize