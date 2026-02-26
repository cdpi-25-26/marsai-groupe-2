import db from "../models/index.js";

const { Vote, VoteHistory, MovieJury, User, Movie } = db;

/**
 * GET /votes — Récupère tous les votes (ADMIN)
 * Inclut les infos utilisateur, film et l'historique de modifications.
 */
async function getVote(req, res) {
    try {
        const votes = await Vote.findAll({
            include: [
                { model: User, attributes: ["id_user", "first_name", "last_name", "email"], required: false },
                { model: Movie, attributes: ["id_movie", "title"], required: false },
                { model: VoteHistory, as: "history", required: false, separate: true, order: [["createdAt", "ASC"]] }
            ]
        });
        return res.json(votes);
    } catch (err) {
        console.error("getVote error:", err);
        return res.status(500).json({ error: err.message });
    }
}


/**
 * POST /:id_movie/:id_user — Crée un vote (ADMIN uniquement)
 * Vérifie l'absence de doublon avant la création.
 */

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

/**
 * GET /votes/mine — Récupère les votes du jury connecté
 * Inclut le film associé et l'historique de chaque vote.
 */

async function getMyVotes(req, res) {
    try {
        const id_user = req.user.id_user;
        const votes = await Vote.findAll({
            where: { id_user },
            include: [
                { model: Movie, attributes: ["id_movie", "title"], required: false },
                { model: VoteHistory, as: "history", required: false, separate: true, order: [["createdAt", "ASC"]] }
            ]
        });
        return res.json(votes);
    } catch (err) {
        console.error("getMyVotes error:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function getMyVoteByMovie(req, res) {
    try {
        const id_user = req.user.id_user;
        const { id_movie } = req.params;

        const vote = await Vote.findOne({
            where: { id_user, id_movie },
            include: [
                { model: Movie, attributes: ["id_movie", "title"], required: false },
                { model: VoteHistory, as: "history", required: false, separate: true, order: [["createdAt", "ASC"]] }
            ]
        });
        if (!vote) {
            return res.status(404).json({ error: "Vote non trouvé" });
        }
        return res.json(vote);
    } catch (err) {
        console.error("getMyVoteByMovie error:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function createOrUpdateMyVote(req, res) {
    try {
        const id_user = req.user.id_user;
        const { id_movie } = req.params;
        const { note, comments } = req.body || {};

        // Validate note is a valid ENUM value
if (!['YES', 'NO', 'TO DISCUSS'].includes(note)) {
  return res.status(400).json({ error: "Note invalide (YES, NO ou TO DISCUSS attendu)" });
}

        if (!comments || !String(comments).trim()) {
            return res.status(400).json({ error: "Commentaire requis" });
        }

        const assigned = await MovieJury.findOne({ where: { id_movie, id_user } });
        if (!assigned) {
            return res.status(403).json({ error: "Film non assigné à ce jury" });
        }

        const existingVote = await Vote.findOne({ where: { id_movie, id_user } });

        if (existingVote) {
            // Verifica se il film è stato approvato dall'admin
            const movie = await Movie.findByPk(id_movie);
            const isApproved = movie?.selection_status === 'selected';
            
            // Incrementa il counter solo se il film è già approvato
            if (isApproved) {
                existingVote.modification_count = (existingVote.modification_count || 0) + 1;
            }
            
            const normalizedComment = String(comments || "");
            const existingComment = String(existingVote.comments || "");
            const hasChanges = existingVote.note !== note || existingComment !== normalizedComment;

            if (hasChanges) {
                await VoteHistory.create({
                    id_vote: existingVote.id_vote,
                    id_movie,
                    id_user,
                    note: existingVote.note,
                    comments: existingVote.comments
                });
            }

            existingVote.note = note;
            existingVote.comments = normalizedComment;
            await existingVote.save();
            return res.json({ 
                message: "Vote mis à jour", 
                vote: existingVote,
                isModified: existingVote.modification_count > 0,
                isApproved
            });
        }

        const newVote = await Vote.create({ 
            note, 
            comments, 
            id_movie, 
            id_user,
            modification_count: 0
        });
        return res.status(201).json({ message: "Vote créé", vote: newVote });
    } catch (err) {
        console.error("createOrUpdateMyVote error:", err);
        return res.status(500).json({ error: err.message });
    }
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

function deleteVotesByMovie(req, res) {
    const { id_movie } = req.params;

    Vote.destroy({ where: { id_movie } })
        .then((deletedCount) => {
            res.status(200).json({ message: "Votes supprimés", deletedCount });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function updateVote(req, res) {
    const { id_vote } = req.params;
    let { note, comments } = req.body;

    Vote.findOne({ where: { id_vote } })
        .then(vote => {
            if (!vote) return res.status(404).json({ error: "Vote non trouvé" });

            // if (note) vote.note = note;
            // if (comments) vote.comments = comments;
            if (note !== undefined) {
    if (['YES', 'NO', 'TO DISCUSS'].includes(note)) vote.note = note;
}
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
    getMyVotes,
    getMyVoteByMovie,
    createOrUpdateMyVote,
    deleteVote,
    updateVote,
    getVoteById,
    findVoteByNote,
    deleteVotesByMovie
};
