const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Course = require('./Course');

const Grade = sequelize.define('Grade', {
  grade_type: {
    type: DataTypes.ENUM('interrogation1', 'interrogation2', 'devoir_terminal'),
    allowNull: false,
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 20,
    },
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
}, {
  timestamps: true,
});

// Une note appartient à un étudiant
Grade.belongsTo(User, { foreignKey: 'student_id', onDelete: 'CASCADE' });
// Une note appartient à un cours
Grade.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });

module.exports = Grade;
