const { News } = require('../models');

// Obtenir toutes les actualités
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll();
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une actualité par ID
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une actualité
exports.createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newNews = await News.create({ title, content });
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une actualité
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }
    await news.update({ title, content });
    res.status(200).json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une actualité
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: 'Actualité non trouvée' });
    }
    await news.destroy();
    res.status(200).json({ message: 'Actualité supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: error.message });
  }
};
