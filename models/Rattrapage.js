const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Course = require('./Course');

const Rattrapage = sequelize.define('Rattrapage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true, // Peut être null si la note n'est pas encore attribuée
    validate: {
      min: 0,
      max: 20 // Supposant que les notes sont sur 20
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true, // Garde les timestamps createdAt et updatedAt
});

// Relations
Rattrapage.belongsTo(User, { 
  foreignKey: 'student_id', 
  as: 'student',
  onDelete: 'CASCADE'
});

Rattrapage.belongsTo(Course, { 
  foreignKey: 'course_id', 
  as: 'course',
  onDelete: 'CASCADE'
});

module.exports = Rattrapage;