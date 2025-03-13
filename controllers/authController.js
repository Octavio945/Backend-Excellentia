const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    // Vérification si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Génération du token JWT avec les informations nécessaires
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        filiereId: user.filiereId // Incluez d'autres champs nécessaires
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Réponse avec le token et toutes les informations de l'utilisateur
    res.status(200).json({ token, user });
  } catch (error) {
    // Gestion des erreurs serveur
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.json(user);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};