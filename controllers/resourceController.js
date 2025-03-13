const { Resource } = require('../models');

// Obtenir toutes les ressources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une ressource par ID
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une ressource
exports.createResource = async (req, res) => {
  try {
    const { title, file_path, course_id } = req.body;
    if (!title || !file_path || !course_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const newResource = await Resource.create({ title, file_path, course_id, uploaded_by: req.userId });
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une ressource
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, file_path } = req.body;
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    await resource.update({ title, file_path });
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une ressource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }
    await resource.destroy();
    res.status(200).json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: error.message });
  }
};
