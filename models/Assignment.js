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
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

Assignment.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });

module.exports = Assignment;