import db from "../models/index.js";

const { Award } = db;

function getAward(req, res) {
    Award.findAll().then((award) => {
        res.json(award);
    })
};

function createAward(req, res) {
    if (!req.body) {
        return res.status(400).json({ error: "Données manquantes" });
    }

    const { award_name } = req.body;
    const { id_movie } = req.params;

    if (!award_name) {
        return res.status(400).json({ error: "Tous les champs doivent être remplis" });
    }

    Award.findOne({ where: { award_name } }).then(async (award) => {
        if (award) {
            res.json({ message: "Award déjà existant", award});
        } else {
            Award.create({
                award_name: award_name,
                id_movie: id_movie
            }).then((newAward) => {
                res.status(201).json({ message: "Award créé", newAward});
            },
        );
        }
    });
}

function deleteAward(req, res) {
    const { id } = req.params;
    Award.destroy({ where: { id } }).then(() => {
        res.status(204).json({ message: "Prix supprimé" });
    });
}

function updateAward(req, res) {
    const { id, id_movie } = req.params;
    const { award_name } = req.body;

    Award.findOne({ where: { id_award: id } })
        .then((award) => {
            if (!award) {
                return res.status(404).json({ error: "Award non trouvé" });
            }

            if (award_name) award.award_name = award_name;
            if (id_movie) award.id_movie = id_movie;

            return award.save(); 
        })
        .then((updatedAward) => {
            res.json({ message: "Award mis à jour", updatedAward });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

function getAwardById(req, res) {
    const { id } = req.params;

    Award.findOne({ where: { id } }).then((award) => {
        if (award) {
            res.json(award);
        } else {
            res.status(404).json({ error: "Award non trouvé" });
        }
    });
}

function findAwardByName(name) {
    return Award.findOne({ where: { award_name: name} });
}

export default {
    getAward,
    createAward,
    deleteAward,
    updateAward,
    getAwardById,
    findAwardByName
}