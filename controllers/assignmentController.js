const { Assignment, Interrogation, DevoirFinal, Grade } = require('../models');

// Obtenir tous les devoirs
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un devoir par ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un devoir
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, due_date, course_id } = req.body;
    if (!title || !description || !due_date || !course_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newAssignment = await Assignment.create({ title, description, due_date, course_id });
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une interrogation pour un devoir
exports.createInterrogation = async (req, res) => {
  try {
    const { title, grade } = req.body;
    if (!title || grade === undefined) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newInterrogation = await Interrogation.create({ title, grade, assignment_id: req.params.id });
    res.status(201).json(newInterrogation);
  } catch (error) {
    console.error('Error creating interrogation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un devoir final pour un devoir
exports.createDevoirFinal = async (req, res) => {
  try {
    const { title, grade } = req.body;
    if (!title || grade === undefined) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newDevoirFinal = await DevoirFinal.create({ title, grade, assignment_id: req.params.id });
    res.status(201).json(newDevoirFinal);
  } catch (error) {
    console.error('Error creating devoir final:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les notes d'un devoir
exports.getNotes = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [Interrogation, DevoirFinal]
    });
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Calculer la note finale d'un devoir
exports.calculateFinalGrade = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [Interrogation, DevoirFinal]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Devoir non trouvé' });
    }

    const interrogationGrades = assignment.Interrogations.map(interrogation => interrogation.grade);
    const devoirFinalGrade = assignment.DevoirFinal ? assignment.DevoirFinal.grade : 0;

    const totalGrade = interrogationGrades.reduce((sum, grade) => sum + grade, 0) + devoirFinalGrade;
    const finalGrade = totalGrade / (interrogationGrades.length + 1);

    res.status(200).json({ finalGrade });
  } catch (error) {
    console.error('Error calculating final grade:', error);
    res.status(500).json({ error: error.message });
  }
};
