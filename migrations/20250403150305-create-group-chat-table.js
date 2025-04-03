'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupChats', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      filiere_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Filieres',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      academic_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AcademicYears',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Ajouter des index pour optimiser les recherches
    await queryInterface.addIndex('GroupChats', ['filiere_id'], {
      name: 'group_chats_filiere_id_idx'
    });
    
    await queryInterface.addIndex('GroupChats', ['academic_year_id'], {
      name: 'group_chats_academic_year_id_idx'
    });
    
    await queryInterface.addIndex('GroupChats', ['sender_id'], {
      name: 'group_chats_sender_id_idx'
    });
    
    await queryInterface.addIndex('GroupChats', ['timestamp'], {
      name: 'group_chats_timestamp_idx'
    });

    // Index composé pour les groupes (filière + année académique)
    await queryInterface.addIndex('GroupChats', ['filiere_id', 'academic_year_id'], {
      name: 'group_chats_filiere_academic_year_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GroupChats');
  }
};