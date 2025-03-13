const { Filiere, Course, User, FiliereCourse } = require('../models');

exports.getAllFilieres = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({
      include: {
        model: Course,
        through: { attributes: [] }, // Ne pas afficher la table pivot
        attributes: ['id', 'title']
      }
    });

    res.status(200).json(filieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des filières:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une filière par ID
exports.getFiliereById = async (req, res) => {
  try {
    const { id } = req.params;
    const filiere = await Filiere.findByPk(id);
    if (!filiere) {
      return res.status(404).json({ message: 'Filière non trouvée' });
    }
    res.status(200).json(filiere);
  } catch (error) {
    console.error('Error fetching filiere:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une filière
exports.createFiliere = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newFiliere = await Filiere.create({ name, description });
    res.status(201).json(newFiliere);
  } catch (error) {
    console.error('Error creating filiere:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une filière
exports.updateFiliere = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const filiere = await Filiere.findByPk(id);
    if (!filiere) {
      return res.status(404).json({ message: 'Filière non trouvée' });
    }
    await filiere.update({ name, description });
    res.status(200).json(filiere);
  } catch (error) {
    console.error('Error updating filiere:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une filière
exports.deleteFiliere = async (req, res) => {
  try {
    const { id } = req.params;
    const filiere = await Filiere.findByPk(id);
    if (!filiere) {
      return res.status(404).json({ message: 'Filière non trouvée' });
    }
    await filiere.destroy();
    res.status(200).json({ message: 'Filière supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting filiere:', error);
    res.status(500).json({ error: error.message });
  }
};

//pour selectionner tout les etudiant d'une filiere 
exports.getStudentsByFiliere = async (req, res) => {
  try {
    const { filiere_id } = req.params;
    // console.log(filiere_id);

    // Vérifier si la filière existe
    const filiere = await Filiere.findByPk(filiere_id);
    if (!filiere) {
      return res.status(404).json({ message: 'Filière non trouvée' });
    }

    // Récupérer tous les étudiants de cette filière
    const students = await User.findAll({
      where: { filiereId: filiere_id, role: 'student' },
      attributes: ['id', 'username', 'email']
    });

    res.status(200).json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des étudiants." });
  }
};
