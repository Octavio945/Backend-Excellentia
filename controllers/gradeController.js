const { User, Filiere, Course, Grade, FiliereCourse } = require('../models');

// Définir les types de notes autorisés
const VALID_GRADE_TYPES = ['interrogation1', 'interrogation2', 'devoir_terminal'];

// Fonction pour gérer les erreurs
const handleError = (res, error, message = 'Erreur serveur') => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// 📌 **Obtenir toutes les notes**
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.status(200).json(grades);
  } catch (error) {
    handleError(res, error, 'Erreur lors de la récupération des notes');
  }
};

// 📌 **Obtenir une note par ID**
exports.getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }
    res.status(200).json(grade);
  } catch (error) {
    handleError(res, error, 'Erreur lors de la récupération de la note');
  }
};

// Obtenir les notes d'un etudiants d'un cours 
exports.getGradesByStudent = async (req, res) => {
  try {
    const { student_id, course_id } = req.params;

    // Vérifier que l'étudiant existe
    const student = await User.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Vérifier que le cours existe
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Récupérer toutes les notes de l'étudiant pour ce cours
    const grades = await Grade.findAll({
      where: { student_id, course_id },
      attributes: ['grade_type', 'grade']
    });

    res.status(200).json(grades);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des notes." });
  }
};

// Méthode pour obtenir les notes d'un étudiant connecté
exports.getGradesForStudent = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'étudiant connecté

    // Récupérer la filière de l'étudiant
    const user = await User.findByPk(userId, {
      include: {
        model: Filiere,
        attributes: ['id', 'name'],
      },
    });

    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const filiereId = user.Filiere.id;
    // console.log(filiereId);

    // Récupérer les cours associés à la filière
    const courses = await FiliereCourse.findAll({
      where: { FiliereId: filiereId },
      include: {
        model: Course,
        as: 'course',
        attributes: ['id', 'title'],
      },
    });
    // console.log(courses);

    if (courses.length === 0) {
      console.log('Aucun cours trouvé pour cette filière.');
    }

    // Récupérer les notes pour chaque cours
    const gradesPromises = courses.map(async (fc) => {
  
      const courseId = fc.course.id;
      const grades = await Grade.findAll({
        where: { student_id: userId, course_id: courseId },
      });
      return {
        course: fc.course.title,
        grades,
      };
    });

    const gradesData = await Promise.all(gradesPromises);

    res.status(200).json(gradesData);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// 📌 **Créer une nouvelle note**
exports.createGrade = async (req, res) => {
  try {
    const { student_id, course_id, grade_type, grade } = req.body;
    // Vérifier si tous les champs sont présents
    if (!student_id || !course_id || !grade_type || grade === undefined) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que le type de note est valide
    if (!['interrogation1', 'interrogation2', 'devoir_terminal'].includes(grade_type)) {
      return res.status(400).json({ message: 'Type de note invalide' });
    }

    // Vérifier si une note du même type existe déjà pour l'étudiant et le cours
    const existingGrade = await Grade.findOne({
      where: { student_id, course_id, grade_type },
    });

    if (existingGrade) {
      // Mise à jour de la note existante
      await existingGrade.update({ grade });
      return res.status(200).json({ message: 'Note mise à jour avec succès', grade: existingGrade });
    } else {
      // Création d’une nouvelle note
      const newGrade = await Grade.create({ student_id, course_id, grade_type, grade });
      return res.status(201).json({ message: 'Note ajoutée avec succès', grade: newGrade });

    }

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 📌 **Mettre à jour une note**
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;

    // Vérifier si la note existe
    const gradeRecord = await Grade.findByPk(id);
    if (!gradeRecord) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    // Mettre à jour la note
    await gradeRecord.update({ grade });

    res.status(200).json({ message: 'Note mise à jour avec succès', grade: gradeRecord });
  } catch (error) {
    handleError(res, error, 'Erreur lors de la mise à jour de la note');
  }
};

// 📌 **Supprimer une note**
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la note existe
    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    // Supprimer la note
    await grade.destroy();

    res.status(200).json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    handleError(res, error, 'Erreur lors de la suppression de la note');
  }
};
