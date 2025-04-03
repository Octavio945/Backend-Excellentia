const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('paid', 'pending'),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'mobile_money', 'bank_transfer', 'other'),
    allowNull: false,
  },
  reference_code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  remaining_amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

Payment.belongsTo(User, { foreignKey: 'student_id' });

module.exports = Payment;