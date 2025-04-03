// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // nom de la table référencée
          key: 'id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'notifications',
      timestamps: true, // créé automatiquement created_at et updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    // Définition de la relation avec le modèle User
    Notification.associate = function(models) {
      Notification.belongsTo(models.User, { 
        foreignKey: 'user_id',
        onDelete: 'CASCADE' // si un utilisateur est supprimé, ses notifications le seront aussi
      });
    };
  
    return Notification;
  };