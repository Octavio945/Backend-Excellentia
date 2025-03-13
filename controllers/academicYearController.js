const { AcademicYear } = require('../models');

// Obtenir toutes les années académiques
exports.getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.findAll();
    res.status(200).json(academicYears);
  } catch (error) {
    console.error('Erreur lors de la récupération des années académiques:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une année académique par ID
exports.getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.findByPk(id);
    if (!academicYear) {
      return res.status(404).json({ message: 'Année académique non trouvée' });
    }
    res.status(200).json(academicYear);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'année académique:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une année académique
exports.createAcademicYear = async (req, res) => {
  try {
    const { start_date, end_date, name } = req.body;
    if (!start_date || !end_date || !name) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newAcademicYear = await AcademicYear.create({
      start_date,
      end_date,
      name
    });
    res.status(201).json(newAcademicYear);
  } catch (error) {
    console.error('Erreur lors de la création de l\'année académique:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une année académique
exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, name } = req.body;
    const academicYear = await AcademicYear.findByPk(id);
    if (!academicYear) {
      return res.status(404).json({ message: 'Année académique non trouvée' });
    }
    await academicYear.update({ start_date, end_date, name });
    res.status(200).json(academicYear);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'année académique:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une année académique
exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.findByPk(id);
    if (!academicYear) {
      return res.status(404).json({ message: 'Année académique non trouvée' });
    }
    await academicYear.destroy();
    res.status(200).json({ message: 'Année académique supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'année académique:', error);
    res.status(500).json({ error: error.message });
  }
};
