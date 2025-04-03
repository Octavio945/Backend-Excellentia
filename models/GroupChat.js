const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Filiere = require('./Filiere');
const AcademicYear = require('./AcademicYear');

const GroupChat = sequelize.define('GroupChat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filiere_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Filiere,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AcademicYear,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
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
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false // Désactive le champ updatedAt car nous utilisons timestamp
});

// Relations
GroupChat.belongsTo(User, { 
  foreignKey: 'sender_id', 
  as: 'sender',
  onDelete: 'CASCADE'
});

GroupChat.belongsTo(Filiere, { 
  foreignKey: 'filiere_id', 
  as: 'filiere',
  onDelete: 'CASCADE'
});

GroupChat.belongsTo(AcademicYear, { 
  foreignKey: 'academic_year_id', 
  as: 'academicYear',
  onDelete: 'CASCADE'
});

module.exports = GroupChat;