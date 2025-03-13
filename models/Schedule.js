const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./Course');
const User = require('./User');
const Filiere = require('./Filiere'); // Ajoutez cette ligne

const Schedule = sequelize.define('Schedule', {
  week_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      isAfterStartTime(value) {
        if (this.start_time && value <= this.start_time) {
          throw new Error('L’heure de fin doit être après l’heure de début.');
        }
      }
    }
  },
  classroom: {
    type: DataTypes.STRING,
    allowNull: true
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
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  filiere_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Filiere,
      key: 'id',
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['week_number'] },
    { fields: ['professor_id'] },
    { fields: ['course_id'] },
    { fields: ['filiere_id'] } // Ajoutez un index pour filiere_id
  ]
});

Schedule.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Schedule.belongsTo(User, { foreignKey: 'professor_id', onDelete: 'CASCADE' });
Schedule.belongsTo(Filiere, { foreignKey: 'filiere_id', onDelete: 'CASCADE' }); // Ajoutez cette ligne

module.exports = Schedule;
