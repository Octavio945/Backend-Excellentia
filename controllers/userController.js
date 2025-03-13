const { User, Filiere, FiliereCourse, Course } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Filiere,  // Inclure la filière associée
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs', details: error.message });
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: Filiere,  // Inclure la filière associée
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé', details: `Aucun utilisateur avec l'ID ${id}` });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur', details: error.message });
  }
};

// Obtenir un utilisateur par son rôle
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;  // Récupérer le rôle depuis la query string

    if (!role || !["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Le rôle est requis et doit être valide !", details: "Le rôle doit être 'admin', 'teacher', ou 'student'" });
    }

    // Recherche des utilisateurs en fonction du rôle
    const users = await User.findAll({ where: { role } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error, details: error.message });
  }
};

// Obtenir les informations de l'utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'profile_picture'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé', details: `Aucun utilisateur avec l'ID ${req.user.id}` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

// Obtenir les cours de l'étudiant connecté
exports.getCoursesForStudent = async (req, res) => {
  try {
    const user = req.user;

    if (!user.filiereId) {
      return res.status(400).json({ error: 'Aucune filière assignée à cet étudiant.', details: `L'étudiant avec l'ID ${user.id} n'a pas de filière assignée.` });
    }

    const courses = await FiliereCourse.findAll({
      where: { FiliereId: user.filiereId },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des cours.', details: error.message });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const {
      username, password, email, role, date_naissance, lieu_naissance, nationalite, sexe,
      adresse, numero_telephone, diplome, etablissement_obtention, annee_diplome, filiereId,
      date_debut, nom_prenom_urgence, telephone_urgence
    } = req.body;

    const users = await User.findAll();

    let userRole = role || 'student'; // Rôle par défaut : student

    // Si aucun utilisateur n'existe encore, le premier devient administrateur
    if (users.length === 0) {
      userRole = 'admin';
    }

    // Vérification des champs obligatoires pour les étudiants
    if (userRole === 'student') {
      if (!username || !password || !email || !date_naissance || !lieu_naissance || !nationalite ||
          !sexe || !adresse || !numero_telephone || !diplome || !etablissement_obtention ||
          !annee_diplome || !filiereId || !date_debut || !nom_prenom_urgence || !telephone_urgence) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis pour les étudiants', details: 'Champs manquants ou invalides' });
      }
    } else {
      // Vérification des champs obligatoires pour tous les utilisateurs
      if (!username || !password || !email) {
        return res.status(400).json({ message: 'Les champs obligatoires (username, password, email) doivent être remplis', details: 'Champs manquants ou invalides' });
      }
    }

    // Vérifier si l'email existe déjà dans la base de données
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé', details: `L'email ${email} est déjà enregistré` });
    }

    // Vérifier si le numéro de téléphone existe déjà
    const existingPhone = await User.findOne({ where: { numero_telephone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Le numéro de téléphone est déjà utilisé', details: `Le numéro ${numero_telephone} est déjà enregistré` });
    }

    // Hachage du mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Définir les champs de date à null si non fournis
    const finalDateNaissance = date_naissance ? new Date(date_naissance) : null;
    const finalDateDebut = date_debut ? new Date(date_debut) : null;

    // Vérifier que la valeur de sexe est valide
    const validSexValues = ['homme', 'femme', 'autre'];
    if (sexe && !validSexValues.includes(sexe)) {
      return res.status(400).json({ message: 'Valeur invalide pour le champ sexe', details: `Le sexe doit être 'homme', 'femme', ou 'autre'` });
    }

    // Création de l'utilisateur
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role: userRole,
      date_naissance: finalDateNaissance,
      lieu_naissance: lieu_naissance || null,
      nationalite: nationalite || null,
      sexe: sexe || null,
      adresse: adresse || null,
      numero_telephone,
      diplome: diplome || null,
      etablissement_obtention: etablissement_obtention || null,
      annee_diplome: annee_diplome || null,
      filiereId: userRole === 'student' ? filiereId : null,
      date_debut: finalDateDebut,
      nom_prenom_urgence: nom_prenom_urgence || null,
      telephone_urgence: telephone_urgence || null
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur', details: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, role, date_naissance, lieu_naissance, nationalite, sexe, adresse, numero_telephone, diplome, etablissement_obtention, annee_diplome, filiereId, date_debut, nom_prenom_urgence, telephone_urgence } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé', details: `Aucun utilisateur avec l'ID ${id}` });
    }

    // Vérification si un autre utilisateur a déjà cet email
    const existingUser = await User.findOne({ where: { email: email, id: { [Op.ne]: id } } });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé par un autre utilisateur', details: `L'email ${email} est déjà enregistré` });
    }

    // Vérification de la filière pour les étudiants
    if (role === 'student' && !filiereId) {
      return res.status(400).json({ message: 'La filière est obligatoire pour les étudiants', details: 'Champ filière manquant' });
    }

    // Hachage du mot de passe si fourni
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : user.password;

    // Définir les champs de date à null si non fournis
    const finalDateNaissance = date_naissance ? new Date(date_naissance) : user.date_naissance;
    const finalDateDebut = date_debut ? new Date(date_debut) : user.date_debut;

    // Vérifier que la valeur de sexe est valide
    if (sexe && !['homme', 'femme', 'autre'].includes(sexe)) {
      return res.status(400).json({ message: 'Valeur invalide pour le champ sexe', details: `Le sexe doit être 'homme', 'femme', ou 'autre'` });
    }

    // Mise à jour de l'utilisateur
    await user.update({
      username,
      password: hashedPassword,
      email,
      role,
      date_naissance: finalDateNaissance,
      lieu_naissance: lieu_naissance || user.lieu_naissance,
      nationalite: nationalite || user.nationalite,
      sexe: sexe || user.sexe,
      adresse: adresse || user.adresse,
      numero_telephone,
      diplome: diplome || user.diplome,
      etablissement_obtention: etablissement_obtention || user.etablissement_obtention,
      annee_diplome: annee_diplome || user.annee_diplome,
      filiereId: role === 'student' ? filiereId : user.filiereId,  // Mise à jour de la filière uniquement si c'est un étudiant
      date_debut: finalDateDebut,
      nom_prenom_urgence: nom_prenom_urgence || user.nom_prenom_urgence,
      telephone_urgence: telephone_urgence || user.telephone_urgence
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', details: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé', details: `Aucun utilisateur avec l'ID ${id}` });
    }
    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur', details: error.message });
  }
};

// Obtenir le nombre total d'utilisateurs
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre total d\'utilisateurs', details: error.message });
  }
};
