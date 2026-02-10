import db from "../models/index.js";
const Event = db.Event;


function getEvents(req, res) {
    Event.findAll().then((event) => {
        res.json(event);
    });
    console.log({
  method: req.method,
  url: req.url,
  params: req.params,
  query: req.query,
  body: req.body,
  user: req.user
});

}

function createEvent(req, res) {
    console.log(req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Données manquantes "});
    }

    const { name, description, start_date, end_date, location, event_type } = req.body;

    if (!name || !description || !start_date || !end_date || !location || !event_type) {
        return res.status(400).json({ error: "Tous les champs doivent être remplis "});
    }

    Event.findOne({ where: { name } })
    .then((event) => {
        if (event) {
            res.json({ message: "Evenement déjà existant", event});
        } else {
            Event.create({
                name: name,
                description: description,
                start_date: start_date,
                end_date: end_date,
                location: location,
                event_type: event_type
            }).then(
                (newEvent) => {
                    res.status(201).json({ message: "Evenment créée", newEvent });
                },
            )
        }
    });
}

function deleteEvent(req, res) {
    const { id_event } = req.params;
    Event.destroy({ where: { id_event }}).then(() => {
        res.status(200).json({ message: "Evenement supprimé" });
    });
}

function updateEvent(req, res) {
    const { id_event } = req.params;
    const { name, description, start_date, end_date, location, event_type } = req.body;

    if (!id_event) {
        return res.status(400).json({ error: "ID manquant dans l'URL" });
    }

    Event.findOne({ where: { id_event } })
        .then((event) => {
            if (!event) {
                return res.status(404).json({ error: "Evenement non trouvé" });
            }

            event.name = name ?? event.name;
            event.description = description ?? event.description;
            event.start_date = start_date ?? event.start_date;
            event.end_date = end_date ?? event.end_date;
            event.location = location ?? event.location;
            event.event_type = event_type ?? event.event_type;

            return event.save();
        })
        .then((updatedEvent) => {
            // This will only run if save() succeeded
            res.status(200).json({
                message: "Evenement mis à jour",
                updatedEvent
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}


function getEventById(req, res) {
    const { id_event } = req.params;

    Event.findOne({ where: { id_event } }).then((event) => {
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: "Evenement non trouvé "});
        }
    });
}

function findEventByName(name) {
    return Event.findOne({ where: { name }});
}

export default {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent,
    getEventById,
    findEventByName
};