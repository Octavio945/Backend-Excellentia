const { FiliereCourse, Filiere, Course, AcademicYear } = require('../models');

// Obtenir tous les FiliereCourses
exports.getAllFiliereCourses = async (req, res) => {
  try {
    const filiereCourses = await FiliereCourse.findAll({
      include: [
        { model: Filiere, as: 'filiere' },
        { model: Course, as: 'course' },
        { model: AcademicYear, as: 'academicYear' }
      ]
    });
    res.status(200).json(filiereCourses);
  } catch (error) {
    console.error('Error fetching FiliereCourses:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des associations filière-cours.' });
  }
};

// Obtenir un FiliereCourse par ID
exports.getFiliereCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const filiereCourse = await FiliereCourse.findByPk(id, {
      include: [
        { model: Filiere, as: 'filiere' },
        { model: Course, as: 'course' },
        { model: AcademicYear, as: 'academicYear' }
      ]
    });

    if (!filiereCourse) {
      return res.status(404).json({ message: 'FiliereCourse non trouvé' });
    }

    res.status(200).json(filiereCourse);
  } catch (error) {
    console.error('Error fetching FiliereCourse:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'association filière-cours.' });
  }
};

// // Récupérer les cours de l'étudiant connecté
// exports.getCoursesForStudent = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Supposons que l'ID de l'étudiant est stocké dans req.user après authentification

//     // Vérifier si l'étudiant existe et récupérer sa filière
//     const student = await Student.findByPk(studentId);
//     if (!student) {
//       return res.status(404).json({ message: "Étudiant non trouvé" });
//     }

//     // Récupérer les cours liés à sa filière via FiliereCourse
//     const courses = await Course.findAll({
//       include: {
//         model: FiliereCourse,
//         where: { FiliereId: student.filiere_id }, // On filtre par la filière de l'étudiant
//         attributes: [] // On ne veut pas afficher les données de la table intermédiaire
//       }
//     });

//     res.status(200).json(courses);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des cours de l'étudiant :", error);
//     res.status(500).json({ error: "Une erreur est survenue lors de la récupération des cours." });
//   }
// };

// Associer un cours à une filière
exports.createFiliereCourse = async (req, res) => {
  try {
    const { academic_year_id, filiere_id, course_id } = req.body;

    if (!academic_year_id || !filiere_id || !course_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'association existe déjà
    const existingFiliereCourse = await FiliereCourse.findOne({
      where: { academic_year_id, FiliereId: filiere_id, CourseId: course_id }
    });

    if (existingFiliereCourse) {
      return res.status(400).json({ message: 'Ce cours est déjà associé à cette filière pour cette année académique.' });
    }

    // Création de l'association
    const newFiliereCourse = await FiliereCourse.create({
      academic_year_id,
      FiliereId: filiere_id,
      CourseId: course_id
    });

    res.status(201).json(newFiliereCourse);
  } catch (error) {
    console.error('Error creating FiliereCourse:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'association filière-cours.' });
  }
};

// Récupérer tous les cours d'une filière
exports.getCoursesByFiliere = async (req, res) => {
  try {
    const { filiere_id } = req.params;

    // Vérifier si la filière existe
    const filiere = await Filiere.findByPk(filiere_id);
    if (!filiere) {
      return res.status(404).json({ message: 'Filière non trouvée' });
    }

    // Récupérer les cours associés à cette filière
    const courses = await Course.findAll({
      include: {
        model: Filiere,
        where: { id: filiere_id },
        attributes: []
      }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des cours.' });
  }
};

// Mettre à jour un FiliereCourse
exports.updateFiliereCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { academic_year_id, filiere_id, course_id } = req.body;

    const filiereCourse = await FiliereCourse.findByPk(id);
    if (!filiereCourse) {
      return res.status(404).json({ message: 'FiliereCourse non trouvé' });
    }

    await filiereCourse.update({
      academic_year_id,
      FiliereId: filiere_id,
      CourseId: course_id
    });

    res.status(200).json(filiereCourse);
  } catch (error) {
    console.error('Error updating FiliereCourse:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'association filière-cours.' });
  }
};

// Supprimer un FiliereCourse
exports.deleteFiliereCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const filiereCourse = await FiliereCourse.findByPk(id);
    if (!filiereCourse) {
      return res.status(404).json({ message: 'FiliereCourse non trouvé' });
    }

    await filiereCourse.destroy();
    res.status(200).json({ message: 'FiliereCourse supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting FiliereCourse:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'association filière-cours.' });
  }
};

// Récupérer les filières associées à un cours
exports.getFilieresByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    // Récupérer les filières associées à ce cours
    const filieres = await FiliereCourse.findAll({
      where: { CourseId: course_id },
      include: [
        { model: Filiere,
          as: 'filiere',
          attributes: ['id', 'name'] 
        },
      ]
    });

    res.status(200).json(filieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des filières:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des filières.' });
  }
};