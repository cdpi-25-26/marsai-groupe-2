# Upload automatique vers YouTube (Watcher)

L’application utilise un système de surveillance de dossier pour uploader automatiquement des vidéos vers YouTube.

Lorsqu’un fichier vidéo est ajouté dans :

back/uploads/


Il est automatiquement détecté et envoyé vers YouTube Data API v3.

# Fonctionnement global
## Surveillance du dossier

**Un watcher basé sur chokidar surveille :**

back/uploads/


**Comportement :**

Ignore le dossier /uploaded

Ignore les fichiers poster-*

**Vérifie que l’extension est autorisée :**

.mp4

.avi

.m4v

.mov

.mpg

.mpeg

.wmv

## Vérification de stabilité du fichier

**Avant l’upload :**

Le système vérifie que le fichier n’est plus en cours d’écriture

Il compare la taille du fichier plusieurs fois

Si la taille est stable → upload autorisé

**Cela évite :**

Upload incomplet

Fichier corrompu

## Système de file d’attente

**Une queue interne empêche :**

Les uploads simultanés

Les conflits

Les dépassements de quota

**Fonctionnement :**

queue[] stocke les vidéos

isUploading bloque les uploads parallèles

processQueue() traite une vidéo à la fois

## Upload avec retry automatique

**Chaque vidéo bénéficie de :**

3 tentatives d’upload

2 secondes d’attente entre chaque tentative

**En cas d’échec définitif :**

L’erreur est loggée

Le système passe au fichier suivant

## Après upload

**Si l’upload réussit :**

L’ID vidéo est affiché

L’URL est loggée :

https://www.youtube.com/watch?v=VIDEO_ID


**Le fichier est déplacé vers :**

back/uploads/uploaded/


**Avec un préfixe timestamp :**

170809384-video.mp4

## Dépendance à l’authentification OAuth2

Le watcher dépend d’un token OAuth valide.

Si aucun token n’est présent :

L’application redirige vers /google/auth

L’utilisateur autorise l’application

Les tokens sont sauvegardés dans :

config/youtube_token.json


## Scope utilisé :

https://www.googleapis.com/auth/youtube.upload


**Ce scope permet :**

Upload de vidéos

Gestion des métadonnées

Définition de la visibilité (public, unlisted, private)