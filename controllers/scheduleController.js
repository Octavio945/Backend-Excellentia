const { Schedule, Course, User, Filiere, FiliereCourse } = require('../models');

// Créer un nouvel emploi du temps
exports.createSchedule = async (req, res) => {
  try {
    const { course_id, filiere_id, week_number, start_date, day_of_week, start_time, end_time, classroom } = req.body;
    console.log('Données reçue : ',  course_id, filiere_id, week_number, start_date, day_of_week, start_time, end_time, classroom )

    // Vérification des champs obligatoires
    if (!course_id || !filiere_id || !week_number || !start_date || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Vérifier si le cours existe
    const course = await Course.findByPk(course_id, {
      include: {
        model: User,
        attributes: ['id']
      }
    });

    console.log('verification : ', course)

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé.' });
    }

    // Récupérer le professeur associé au cours
    const professor_id = course.teacher_id;

    console.log('recuperation du prof ', professor_id)
    // Vérifier que l'heure de fin est après l'heure de début
    if (start_time >= end_time) {
      return res.status(400).json({ message: 'L\'heure de fin doit être après l\'heure de début.' });
    }

    // Vérifier si le cours est associé à la filière
    const filiereCourse = await FiliereCourse.findOne({
      where: { CourseId: course_id, FiliereId: filiere_id }
    });

    console.log('verifier le cours dan FIliereCOurse : ', filiereCourse)
    if (!filiereCourse) {
      return res.status(400).json({ message: 'Ce cours n\'est pas associé à la filière spécifiée.' });
    }

    // Création de l'emploi du temps avec le professeur et la filière associés
    const newSchedule = await Schedule.create({
      course_id,
      filiere_id, // Utilisez le filiere_id fourni
      week_number,
      start_date,
      day_of_week,
      start_time,
      end_time,
      classroom,
      professor_id
    });

    console.log(newSchedule)
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Erreur lors de la création de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

// Récupérer les emplois du temps d'une filière
exports.getScheduleByFiliere = async (req, res) => {
  try {
    const { filiere_id } = req.params;


    // Récupérer l'emploi du temps pour une filière spécifique
    const schedule = await Schedule.findAll({
      where: { filiere_id }, // Filtrer directement par filiere_id
      include: [
        { model: Course },
        { model: User}
      ],
      order: [['week_number', 'ASC'], ['day_of_week', 'ASC'], ['start_time', 'ASC']]
    });

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

// Récupérer les emplois du temps pour le professeur connecté
exports.getScheduleForConnectedProfessor = async (req, res) => {
  try {
    const professor_id = req.user.id; // L'ID du professeur est stocké dans req.user après authentification
    console.log('ID du professeur pour les emplois du temps:', professor_id); // Log pour vérifier l'ID du professeur

    // Récupérer l'emploi du temps pour le professeur connecté
    const schedule = await Schedule.findAll({
      where: { professor_id },
      include: [
        {
          model: Course,
          include: [
            {
              model: Filiere,
              through: { attributes: [] }
            }
          ]
        }
      ],
      order: [['week_number', 'ASC'], ['day_of_week', 'ASC'], ['start_time', 'ASC']]
    });

    console.log('Emplois du temps du professeur connecté:', schedule); // Log pour vérifier les emplois du temps récupérés

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Erreur lors de la récupération des emplois du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

// Récupérer les emplois du temps pour l'étudiant connecté
exports.getScheduleForConnectedStudent = async (req, res) => {
  try {
    const filiere_id = req.user.filiereId;

    // Récupérer l'emploi du temps pour la filière de l'étudiant
    const schedule = await Schedule.findAll({
      where: { filiere_id },
      include: [
        { model: Course },
        { model: User}
      ],
      order: [['week_number', 'ASC'], ['day_of_week', 'ASC'], ['start_time', 'ASC']]
    });

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Erreur lors de la récupération des emplois du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

// Obtenir tous les emplois du temps
// exports.getAllSchedules = async (req, res) => {
//   try {
//     const schedules = await Schedule.findAll({
//       include: [
//         { model: Course, attributes: ['id', 'title'] },
//         { model: User, attributes: ['id', 'username'] }
//       ],
//       order: [['week_number', 'ASC'], ['day_of_week', 'ASC'], ['start_time', 'ASC']]
//     });
//     res.status(200).json(schedules);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des emplois du temps:', error);
//     res.status(500).json({ error: 'Erreur interne du serveur.' });
//   }
// };

// Obtenir un emploi du temps par ID
// exports.getScheduleById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const schedule = await Schedule.findByPk(id, {
//       include: [
//         { model: Course, attributes: ['id', 'title'] },
//         { model: User, attributes: ['id', 'username'] }
//       ]
//     });
//     if (!schedule) {
//       return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
//     }
//     res.status(200).json(schedule);
//   } catch (error) {
//     console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
//     res.status(500).json({ error: 'Erreur interne du serveur.' });
//   }
// };


// Mettre à jour un emploi du temps existant
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { week_number, start_date, day_of_week, start_time, end_time, classroom } = req.body;

    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
    }

    if (start_time && end_time && start_time >= end_time) {
      return res.status(400).json({ message: 'L\'heure de fin doit être après l\'heure de début.' });
    }

    await schedule.update({
      week_number,
      start_date,
      day_of_week,
      start_time,
      end_time,
      classroom
    });

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

// Supprimer un emploi du temps
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
    }
    await schedule.destroy();
    res.status(200).json({ message: 'Emploi du temps supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};
