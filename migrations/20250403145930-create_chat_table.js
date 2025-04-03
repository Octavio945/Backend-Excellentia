'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      chat_type: {
        type: Sequelize.ENUM('student-teacher', 'student-admin', 'student-student'),
        allowNull: false
      }
    });

    // Ajouter des index pour optimiser les recherches
    await queryInterface.addIndex('Chats', ['sender_id'], {
      name: 'chats_sender_id_idx'
    });
    
    await queryInterface.addIndex('Chats', ['receiver_id'], {
      name: 'chats_receiver_id_idx'
    });
    
    await queryInterface.addIndex('Chats', ['timestamp'], {
      name: 'chats_timestamp_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};