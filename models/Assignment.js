const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./Course');

const Assignment = sequelize.define('Assignment', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

Assignment.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });

module.exports = Assignment;
