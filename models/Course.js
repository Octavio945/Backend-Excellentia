const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const AcademicYear = require('./AcademicYear');

const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

Course.belongsTo(User, { foreignKey: 'teacher_id', onDelete: 'CASCADE' });
Course.belongsTo(AcademicYear, { foreignKey: 'academic_year_id', onDelete: 'CASCADE' });

module.exports = Course;
