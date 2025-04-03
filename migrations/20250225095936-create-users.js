'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.ENUM('student', 'teacher', 'admin'),
        allowNull: false,
        defaultValue: 'student'
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      date_naissance: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lieu_naissance: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nationalite: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sexe: {
        type: Sequelize.ENUM('homme', 'femme', 'autre'),
        allowNull: true
      },
      adresse: {
        type: Sequelize.STRING,
        allowNull: true
      },
      numero_telephone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      diplome_obtenu: {
        type: Sequelize.STRING,
        allowNull: true
      },
      etablissement_obtention: {
        type: Sequelize.STRING,
        allowNull: true
      },
      annee_diplome: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date_debut: {
        type: Sequelize.DATE,
        allowNull: true
      },
      nom_urgence: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prenom_urgence: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telephone_urgence: {
        type: Sequelize.STRING,
        allowNull: true
      },
      filiereId: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        references: {
          model: 'Filieres', 
          key: 'id'
        },
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'AcademicYears',
          key: 'id'
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};