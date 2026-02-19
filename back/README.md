# Backend

Une fois que vous avez cloné le starter kit, être sûr(e) d'être dans le répertoire back

## Installer les dépendances

```sh
npm install
```

## Démarrer le serveur

```sh
npm start
```


## Esportare e importare utenti e film (seed JSON)

Per condividere i dati di utenti e film tra colleghi:

### Esportazione
1. Esegui:
	```sh
	node scripts/export-movies-users.js
	```
	Verranno creati i file `exported-users.json` e `exported-movies.json`.

### Importazione
1. Copia i file `exported-users.json` e `exported-movies.json` nella cartella `back` del tuo progetto.
2. Esegui:
	```sh
	node scripts/import-movies-users.js
	```
	Questo importerà utenti e film nella base dati.

> **Nota:** Se aggiorni i dati, basta rieseguire questi script per sincronizzare.

### Domanda: posso cancellare i file in uploads?
La cartella `uploads` contiene i file caricati dagli utenti (immagini, trailer, ecc). Puoi cancellare i file **solo se**:
- Non ti servono più per lo sviluppo o la produzione
- Non sono referenziati da film nella base dati

Se vuoi solo condividere dati strutturati (film, utenti), puoi ignorare o svuotare `uploads`. Se invece i film fanno riferimento a file presenti lì (es. immagini), la loro assenza potrebbe causare errori o immagini mancanti nell'applicazione.
