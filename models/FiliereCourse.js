const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Filiere = require('./Filiere');
const Course = require('./Course');
const AcademicYear = require('./AcademicYear');

const FiliereCourse = sequelize.define('FiliereCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'AcademicYears',
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  FiliereId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Filieres',
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  CourseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id',
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true,
});

// Assurez-vous que les associations sont définies
Filiere.belongsToMany(Course, { through: FiliereCourse, onDelete: 'CASCADE' });
Course.belongsToMany(Filiere, { through: FiliereCourse, onDelete: 'CASCADE' });

FiliereCourse.belongsTo(AcademicYear, {
  foreignKey: 'academic_year_id',
  as: 'academicYear',
  onDelete: 'CASCADE'
});

FiliereCourse.belongsTo(Course, {
  foreignKey: 'CourseId',
  as: 'course',
  onDelete: 'CASCADE'
});

FiliereCourse.belongsTo(Filiere, {
  foreignKey: 'FiliereId',
  as: 'filiere',
  onDelete: 'CASCADE'
});

module.exports = FiliereCourse;