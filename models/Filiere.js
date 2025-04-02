const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Filiere = sequelize.define('Filiere', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Filiere;