const sequelize = require('./config/db');
const models = require('./models'); // Importer tous les modèles

// (async () => {
//   try {
//     // Synchroniser tous les modèles
//     await sequelize.sync({ force: true }); // `force: true` recrée les tables à chaque exécution
//     console.log('Base de données synchronisée avec succès !');
//   } catch (error) {
//     console.error('Erreur lors de la synchronisation de la base de données :', error);
//   } finally {
//     await sequelize.close(); // Fermer la connexion après synchronisation
//   }
// })();

sequelize.sync({alter: true})
    .then(() => {
        console.log('Base de Données Synchronisée');
    })
    .catch(err => {
        console.error('Erreur lors de la synchronisation de la Base de Données ', err)
    } );