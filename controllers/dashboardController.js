const { User, Course, Payment } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
      // Compter les utilisateurs
      const totalUsers = await User.count();
  
      // Compter les cours
      const totalCourses = await Course.count();
  
      // Compter les paiements effectués
      const totalPayments = await Payment.count({
        where: { status: 'paid' } // Assure-toi d'avoir un champ `status`
      });
  
      // Compter les paiements en attente
      const paymentPending = await Payment.count({
        where: { status: 'pending' }
      });
  
      // Retourner les statistiques
      res.status(200).json({
        totalUsers,
        totalCourses,
        totalPayments,
        paymentPending
      });
  
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des statistiques." });
    }
  };