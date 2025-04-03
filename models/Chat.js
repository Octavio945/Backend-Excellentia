const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  chat_type: {
    type: DataTypes.ENUM('student-teacher', 'student-admin', 'student-student'),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false // Désactive le champ updatedAt car nous utilisons timestamp
});

// Relations avec les utilisateurs
Chat.belongsTo(User, { 
  foreignKey: 'sender_id', 
  as: 'sender',
  onDelete: 'CASCADE'
});

Chat.belongsTo(User, { 
  foreignKey: 'receiver_id', 
  as: 'receiver',
  onDelete: 'CASCADE'
});

module.exports = Chat;