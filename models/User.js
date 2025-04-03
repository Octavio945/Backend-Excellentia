const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Filiere = require('./Filiere'); 
const AcademicYear = require('./AcademicYear'); // Import académique year

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
  date_naissance: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lieu_naissance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationalite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sexe: {
    type: DataTypes.ENUM('homme', 'femme', 'autre'),
    allowNull: true,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero_telephone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  diplome_obtenu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  etablissement_obtention: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  annee_diplome: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nom_urgence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prenom_urgence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone_urgence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  filiereId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Filiere,
      key: 'id',
    },
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AcademicYear,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Relation avec Filiere
User.belongsTo(Filiere, { foreignKey: 'filiereId' });

// Relation avec AcademicYear
User.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

// Validation pour rendre la filière obligatoire uniquement pour les étudiants
User.beforeValidate((user, options) => {
  if (user.role === 'student' && !user.filiereId) {
    throw new Error('La filière est obligatoire pour les étudiants.');
  }
});

module.exports = User;