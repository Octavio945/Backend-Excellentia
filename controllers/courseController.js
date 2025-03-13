const { Course, User, AcademicYear } = require('../models');

// Obtenir tous les cours avec leurs relations associées
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: User, attributes: ['username'] }, // Inclure le nom d'utilisateur du professeur
        { model: AcademicYear } // Inclure l'année académique
      ]
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la récupération des cours." });
  }
};

// Obtenir un cours par ID avec ses relations associées
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: AcademicYear }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la récupération du cours." });
  }
};

// les cours d'un professeur 
exports.getCoursesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assurez-vous que l'ID du professeur est disponible dans req.user
    const courses = await Course.findAll({
      where: { teacher_id: teacherId },
    });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
  }
};

// Créer un cours
exports.createCourse = async (req, res) => {
  try {
    const { title, description, teacher_id, academic_year_id } = req.body;

    if (!title || !description || !teacher_id || !academic_year_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Création du cours
    const newCourse = await Course.create({ title, description, teacher_id, academic_year_id });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la création du cours." });
  }
};

// Mettre à jour un cours
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teacher_id, academic_year_id } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Mise à jour du cours
    await course.update({ title, description, teacher_id, academic_year_id });

    res.status(200).json(course);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour du cours." });
  }
};

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Supprime le cours
    await course.destroy();
    res.status(200).json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    res.status(500).json({ error: "Une erreur est survenue lors de la suppression du cours." });
  }
};
