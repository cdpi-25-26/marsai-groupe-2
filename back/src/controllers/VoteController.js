import db from "../models/index.js";

const { Vote } = db;

function getVote(req, res) {
    Vote.findAll()
        .then((votes) => res.json(votes))
        .catch(err => res.status(500).json({ error: err.message }));
}

function createVote(req, res) {
    if (!req.body) {
        return res.status(400).json({ error: "Données manquantes" });
    }

    const { note, comments } = req.body;
    const { id_movie, id_user } = req.params;

    Vote.findOne({ where: { id_movie, id_user } })
        .then(existingVote => {
            if (existingVote) {
                return res.status(409).json({ message: "Vote déjà existant", existingVote });
            }
            return Vote.create({ note, comments, id_movie, id_user });
        })
        .then(newVote => {
            if (newVote) res.status(201).json({ message: "Vote créé", newVote });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function deleteVote(req, res) {
    const { id } = req.params;

    Vote.destroy({ where: { id_vote: id } })
        .then(deleted => {
            if (deleted) {
                res.status(200).json({ message: "Vote supprimé" });
            } else {
                res.status(404).json({ error: "Vote non trouvé" });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function updateVote(req, res) {
    const { id_vote } = req.params;
    const { note, comments } = req.body;

    Vote.findOne({ where: { id_vote } })
        .then(vote => {
            if (!vote) return res.status(404).json({ error: "Vote non trouvé" });

            if (note) vote.note = note;
            if (comments) vote.comments = comments;

            return vote.save();
        })
        .then(updatedVote => {
            if (updatedVote) res.json(updatedVote);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function getVoteById(req, res) {
    const { id_vote } = req.params;

    Vote.findOne({ where: { id_vote } })
        .then(vote => {
            if (vote) res.json(vote);
            else res.status(404).json({ error: "Vote non trouvé" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function findVoteByNote(note) {
    return Vote.findOne({ where: { note } });
}

export default {
    getVote,
    createVote,
    deleteVote,
    updateVote,
    getVoteById,
    findVoteByNote
};
