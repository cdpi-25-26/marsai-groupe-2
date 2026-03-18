import db from "../models/index.js";
import fs from "fs";
import path from "path";

async function createSponsor(req, res){
  try {
    const { name, url, category } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({
        error: "Name and logo are required"
      });
    }

    const logoPath = `/uploads/sponsors/${req.file.filename}`;

    const sponsor = await db.Sponsor.create({
      name,
      logo: logoPath,
      url,
      category
    });

    return res.status(201).json(sponsor);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

 // GET ALL
 
async function getAllSponsors(req, res){
  try {
    const sponsors = await db.Sponsor.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(sponsors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


 // GET ONE
 
async function getSponsorById(req, res){
  try {
    const { id } = req.params;

    const sponsor = await db.Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({
        error: "Sponsor not found"
      });
    }

    return res.status(200).json(sponsor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


 // UPDATE

/*export const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;

    const sponsor = await db.Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({
        error: "Sponsor not found"
      });
    }

    await sponsor.update(req.body);

    return res.status(200).json(sponsor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};*/

// UPDATE AVEC UPLOAD LOGO

async function updateSponsor(req, res){
  try {
    const { id } = req.params;

    const sponsor = await db.Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({
        error: "Sponsor not found"
      });
    }

    let updatedData = {
      name: req.body.name,
      url: req.body.url,
      category: req.body.category
    };

    if (req.file) {
      updatedData.logo = `/uploads/sponsors/${req.file.filename}`;
    }

    await sponsor.update(updatedData);

    return res.status(200).json(sponsor);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

 //DELETE

async function deleteSponsor(req, res){
  try {
    const { id } = req.params;

    const sponsor = await db.Sponsor.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({
        error: "Sponsor not found"
      });
    }

    //  Supprimer le fichier image s'il existe
    if (sponsor.logo) {
      const filePath = path.join(process.cwd(), sponsor.logo);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    //  Supprimer le sponsor en base
    await sponsor.destroy();

    return res.status(200).json({
      message: "Sponsor and logo deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  updateSponsor,
  deleteSponsor
};
