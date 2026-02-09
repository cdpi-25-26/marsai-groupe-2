import db from "../models/index.js";

const Categorie = db.Categorie;


//-1- Voir toutes les catégories (public)
 
async function getCategories(req, res) {
  try {
    const categories = await Categorie.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


 //-2️- Voir une catégorie par ID (public)

async function getCategorieById(req, res) {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    res.json(categorie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


 //-3- Créer une catégorie (ADMIN)
 
async function createCategorie(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Le nom est obligatoire" });
    }

    const existing = await Categorie.findOne({ where: { name } });

    if (existing) {
      return res.status(400).json({ error: "Catégorie déjà existante" });
    }

    const categorie = await Categorie.create({ name });

    res.status(201).json({
      message: "Catégorie créée avec succès",
      categorie
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//-4- Modifier une catégorie (ADMIN)

async function updateCategorie(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    categorie.name = name || categorie.name;

    await categorie.save();

    res.json({
      message: "Catégorie mise à jour",
      categorie
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//-5- Supprimer une catégorie (ADMIN)
 
async function deleteCategorie(req, res) {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    await categorie.destroy();

    res.json({ message: "Catégorie supprimée" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  getCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie
};
