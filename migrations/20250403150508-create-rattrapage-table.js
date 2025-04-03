'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rattrapages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      grade: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
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

    // Ajouter des index pour optimiser les recherches
    await queryInterface.addIndex('Rattrapages', ['student_id'], {
      name: 'rattrapages_student_id_idx'
    });
    
    await queryInterface.addIndex('Rattrapages', ['course_id'], {
      name: 'rattrapages_course_id_idx'
    });
    
    await queryInterface.addIndex('Rattrapages', ['date'], {
      name: 'rattrapages_date_idx'
    });

    // Index composé pour rechercher les rattrapages d'un étudiant pour un cours spécifique
    await queryInterface.addIndex('Rattrapages', ['student_id', 'course_id'], {
      name: 'rattrapages_student_course_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rattrapages');
  }
};