# Front

Une fois que vous avez cloné le starter kit, être sûr(e) d'être dans le répertoire front

## Installer les dépendances

```sh
npm install
```

## Démarrer le serveur

```sh
npm run dev
```

## Lecture vidéo (Vidstack)

La lecture des films utilise Vidstack. Les styles sont importés dans les pages vidéo (admin, jury, producer).

```js
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
```

## 🌍 Système de traduction (i18n)

- Les fichiers de traduction sont dans [src/locales](src/locales) (ex: en.json, fr.json).
- L'initialisation i18n est définie dans [src/i18n.js](src/i18n.js).
- Pour activer i18n, installez les dépendances :
  - `i18next`
  - `react-i18next`
- Puis réactivez l'import dans [src/main.jsx](src/main.jsx).
