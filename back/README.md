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


## Exporter et importer les utilisateurs et les films (seed JSON)

Pour partager les données des utilisateurs et des films avec vos collègues :

### Exportation

1. Exécutez :
   ```sh
   node scripts/export-movies-users.js
   ```
   Cela créera les fichiers `exported-users.json` et `exported-movies.json`.

### Importation

1. Copiez les fichiers `exported-users.json` et `exported-movies.json` dans le dossier `back` de votre projet.
2. Exécutez :
   ```sh
   node scripts/import-movies-users.js
   ```
   Cela importera les utilisateurs et les films dans la base de données.

> **Remarque :** Si vous mettez à jour les données, il suffit de relancer ces scripts pour synchroniser.

### Nettoyer le dossier uploads

Le dossier `uploads` contient les fichiers téléchargés par les utilisateurs (images, trailers, etc.). Vous pouvez supprimer les fichiers **seulement si** :

- Ils ne sont plus nécessaires pour le développement ou la production
- Ils ne sont pas référencés par des films dans la base de données

Pour vérifier quels fichiers sont réellement utilisés par les films :

1. Exécutez :
   ```sh
   node scripts/check-used-uploads.js
   ```
   Cela générera deux fichiers :
   - `uploads-used.json` : fichiers utilisés par les films (à conserver)
   - `uploads-unused.json` : fichiers non référencés (vous pouvez les supprimer en toute sécurité)

Si vous partagez uniquement les données structurées (films, utilisateurs), vous pouvez ignorer ou vider `uploads`. Si les films référencent des fichiers présents dans ce dossier (ex : images), leur absence peut entraîner des erreurs ou des images manquantes dans l’application.
