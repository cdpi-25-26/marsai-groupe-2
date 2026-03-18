import db from "../models/index.js";

function getReservations(req, res) {
    db.Reservation.findAll()
    .then((reservation) => res.json(reservation))
    .catch((err) => res.status(500).json({ error: err.message }));
};

function createReservation(req, res) {
    
    if (!req.body) {
        return res.status(400).json({ error: "Données manquantes"});
    }

    const { id_event, first_name, last_name, email, number_seats, reservation_date } = req.body;

    if (!id_event || !first_name || !last_name || !email || !number_seats || !reservation_date) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    db.Reservation.findOne({ where: { email, id_event } })
    .then((reservation) => {
        if (reservation) {
            return res.status(409).json({ message: "Réservation déjà existante", reservation});
        } else {
            return db.Reservation.create({
                id_event: id_event,
                first_name: first_name,
                last_name: last_name,
                email: email,
                number_seats: number_seats,
                reservation_date: reservation_date
            }).then(
                (newReservation) => {
                    res.status(201).json({ message: "Réservation crée", newReservation });
                });
        }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
}

function deleteReservation(req, res) {
    const { id_reservation } = req.params;
    db.Reservation.destroy({ where: { id_reservation } })
    .then((deleted) => {
        if (deleted) {
            res.status(200).json({ message: "Réservation supprimée" });
        } else {
            res.status(404).json({ error: "Réservation non trouvée" });
        }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
}

function updateReservation(req, res) {
    const { id_reservation } = req.params;

    const { id_event, first_name, last_name, email, number_seats, reservation_date } = req.body;

    db.Reservation.findOne({ where: { id_reservation } })
    .then((reservation) => {
        if (reservation) {
            reservation.id_event = id_event || reservation.id_event;
            reservation.first_name = first_name || reservation.first_name;
            reservation.last_name = last_name || reservation.last_name;
            reservation.email = email || reservation.email;
            reservation.number_seats = number_seats || reservation.number_seats;
            reservation.reservation_date = reservation_date || reservation.reservation_date;

            reservation.save().then((updatedReservation) => {
                res.json(updatedReservation);
            });
        } else {
            res.status(404).json({ error: "Réservation non trouvée" });
        }
    });
}

function getReservationById(req, res) {
    const { id_reservation } = req.params;

    db.Reservation.findOne({ where: { id_reservation }} ).then((reservation) => {
        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).json({ error: "Réservation non trouvée" });
        }
    });
}

function findReservationByMail(email) {
    return db.Reservation.findOne({ where: { email }});
}

export default {
    getReservations,
    createReservation,
    deleteReservation,
    updateReservation,
    getReservationById,
    findReservationByMail
}