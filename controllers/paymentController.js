const { Payment } = require('../models');

// Obtenir tous les paiements
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un paiement
exports.createPayment = async (req, res) => {
  try {
    const { student_id, amount, payment_date, payment_method, reference_code, status } = req.body;

    if (!student_id || !amount || !payment_date || !payment_method || !status) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier si reference_code est déjà utilisé
    if (reference_code) {
      const existingPayment = await Payment.findOne({ where: { reference_code } });
      if (existingPayment) {
        return res.status(400).json({ message: 'Ce code de référence est déjà utilisé' });
      }
    }

    const newPayment = await Payment.create({
      student_id,
      amount,
      payment_date,
      payment_method,
      reference_code,
      status
    });

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un paiement
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_date, payment_method, reference_code, status } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Vérifier si reference_code est déjà utilisé par un autre paiement
    if (reference_code && reference_code !== payment.reference_code) {
      const existingPayment = await Payment.findOne({ where: { reference_code } });
      if (existingPayment) {
        return res.status(400).json({ message: 'Ce code de référence est déjà utilisé' });
      }
    }

    await payment.update({ amount, payment_date, payment_method, reference_code, status });
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un paiement
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID du paiement requis' });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    await payment.destroy();
    res.status(200).json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: error.message });
  }
};
