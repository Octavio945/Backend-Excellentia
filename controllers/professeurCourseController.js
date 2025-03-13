const { ProfesseurCourse, User, Course } = require('../models');

// Obtenir toutes les associations entre professeurs et cours
exports.getAllProfesseurCourses = async (req, res) => {
  try {
    const professeurCourses = await ProfesseurCourse.findAll({
      include: [
        { model: User, as: 'Professeur' },
        { model: Course, as: 'Course' }
      ]
    });
    res.status(200).json(professeurCourses);
  } catch (error) {
    console.error('Error fetching professeur courses:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une association entre professeur et cours par ID
exports.getProfesseurCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const professeurCourse = await ProfesseurCourse.findByPk(id, {
      include: [
        { model: User, as: 'Professeur' },
        { model: Course, as: 'Course' }
      ]
    });
    if (!professeurCourse) {
      return res.status(404).json({ message: 'Association professeur-cours non trouvée' });
    }
    res.status(200).json(professeurCourse);
  } catch (error) {
    console.error('Error fetching professeur course:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une association entre professeur et cours
exports.createProfesseurCourse = async (req, res) => {
  try {
    const { professeur_id, course_id } = req.body;
    if (!professeur_id || !course_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newProfesseurCourse = await ProfesseurCourse.create({ professeur_id, course_id });
    res.status(201).json(newProfesseurCourse);
  } catch (error) {
    console.error('Error creating professeur course:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une association entre professeur et cours
exports.deleteProfesseurCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const professeurCourse = await ProfesseurCourse.findByPk(id);
    if (!professeurCourse) {
      return res.status(404).json({ message: 'Association professeur-cours non trouvée' });
    }
    await professeurCourse.destroy();
    res.status(200).json({ message: 'Association professeur-cours supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting professeur course:', error);
    res.status(500).json({ error: error.message });
  }
};
