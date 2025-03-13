const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Course = require('./Course');
const AcademicYear = require('./AcademicYear');

const ProfesseurCourse = sequelize.define('ProfesseurCourse', {
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AcademicYear,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
}, {
  timestamps: true,
});

User.belongsToMany(Course, { through: ProfesseurCourse, onDelete: 'CASCADE' });
Course.belongsToMany(User, { through: ProfesseurCourse, onDelete: 'CASCADE' });

ProfesseurCourse.belongsTo(AcademicYear, {
  foreignKey: 'academic_year_id',
  as: 'academicYear',
  onDelete: 'CASCADE'
});

module.exports = ProfesseurCourse;
