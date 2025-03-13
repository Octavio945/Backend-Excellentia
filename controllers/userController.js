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
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un utilisateur par son rôle
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;  // Récupérer le rôle depuis la query string

    if (!role || !["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Le rôle est requis et doit être valide !" });
    }

    // Recherche des utilisateurs en fonction du rôle
    const users = await User.findAll({ where: { role } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//Obtenir les informations de l'utilisateur connecté 
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'profile_picture'],
    });
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Obtenir les cours des etudiant connecté 
exports.getCoursesForStudent = async (req, res) => {
  try {
    const user = req.user;
    // console.log("Connected User:", user); // Log de l'utilisateur connecté

    if (!user.filiereId) {
      return res.status(400).json({ error: 'Aucune filière assignée à cet étudiant.' });
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
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des cours.' });
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

    // Vérification des champs obligatoires
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Vérifier si l'email existe déjà dans la base de données
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    // Vérifier si le numéro de téléphone existe déjà
    const existingPhone = await User.findOne({ where: { numero_telephone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Le numéro de téléphone est déjà utilisé' });
    }

    // Vérifier si l'utilisateur est un étudiant et que la filière est présente
    if (userRole === 'student' && !filiereId) {
      return res.status(400).json({ message: 'La filière est obligatoire pour les étudiants' });
    }

    // Hachage du mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role: userRole,
      date_naissance,
      lieu_naissance,
      nationalite,
      sexe,
      adresse,
      numero_telephone,
      diplome,
      etablissement_obtention,
      annee_diplome,
      filiereId: userRole === 'student' ? filiereId : null,
      date_debut,
      nom_prenom_urgence,
      telephone_urgence
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};


// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, role, date_naissance, lieu_naissance, nationalite, sexe, adresse, numero_telephone, diplome, etablissement_obtention, annee_diplome, filiereId, date_debut, nom_prenom_urgence, telephone_urgence } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification si un autre utilisateur a déjà cet email
    const existingUser = await User.findOne({ where: { email: email, id: { [Op.ne]: id } } });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé par un autre utilisateur' });
    }

    // Vérification de la filière pour les étudiants
    if (role === 'student' && !filiereId) {
      return res.status(400).json({ message: 'La filière est obligatoire pour les étudiants' });
    }

    // Hachage du mot de passe si fourni
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : user.password;

    // Mise à jour de l'utilisateur
    await user.update({
      username,
      password: hashedPassword,
      email,
      role,
      date_naissance,
      lieu_naissance,
      nationalite,
      sexe,
      adresse,
      numero_telephone,
      diplome,
      etablissement_obtention,
      annee_diplome,
      filiereId: role === 'student' ? filiereId : user.filiereId,  // Mise à jour de la filière uniquement si c'est un étudiant
      date_debut,
      nom_prenom_urgence,
      telephone_urgence
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir le nombre total d'utilisateurs
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ error: error.message });
  }
};