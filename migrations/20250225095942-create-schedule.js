'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      classroom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Courses',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      professor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      filiere_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Filieres',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // Ajout des index pour optimiser les recherches
    await queryInterface.addIndex('Schedules', {
      fields: ['week_number'],
      name: 'schedules_week_number_idx'
    });
    await queryInterface.addIndex('Schedules', {
      fields: ['professor_id'],
      name: 'schedules_professor_id_idx'
    });
    await queryInterface.addIndex('Schedules', {
      fields: ['course_id'],
      name: 'schedules_course_id_idx'
    });
    await queryInterface.addIndex('Schedules', {
      fields: ['filiere_id'],
      name: 'schedules_filiere_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  }
};
