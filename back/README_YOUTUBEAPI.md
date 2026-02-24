# Configuration API YouTube & Google OAuth2

## Créer un compte Google

**Commencez par créer un compte Google si vous n'en avez pas déjà un :**
👉 https://accounts.google.com

# Créer un projet Google Cloud

**Accédez à la console :**
https://console.cloud.google.com/

Cliquez sur Créer un projet

Donnez un nom à votre projet

Cliquez sur Créer

## Activer les API nécessaires

**Dans votre projet :**

Allez dans API et services > Bibliothèque

**Recherchez et activez :**

YouTube Data API v3


# Configuration OAuth 2.0

**L’API YouTube nécessite une authentification via OAuth 2.0 pour accéder aux données privées d’un utilisateur.**

## Configurer l’écran de consentement OAuth

**Avant de créer les identifiants, vous devez configurer l’écran de consentement.**

Allez dans API et services > Écran de consentement OAuth

**Choisissez le type :**

Externe 

**Remplissez :**

Nom de l’application

Email de support

Email développeur

# Ajouter les scopes

**Les scopes définissent les permissions demandées à l’utilisateur.**

Exemples pour YouTube :

https://www.googleapis.com/auth/youtube.readonly 
→ Lecture seule

https://www.googleapis.com/auth/youtube 
→ Accès complet au compte YouTube

**SCOPE RECOMMANDE:**
https://www.googleapis.com/auth/youtube.upload 
→ Upload de vidéos

**Principe de sécurité :**
Demandez uniquement les scopes nécessaires (principe du moindre privilège).

# Ajouter des Test Users (Mode Test)

**Tant que votre application n’est pas validée par Google :**

Elle est en mode Test

Seuls les utilisateurs ajoutés comme Test Users peuvent se connecter

**Ajouter des utilisateurs de test :**

Allez dans Écran de consentement OAuth
Audience -> Utilisateurs tests + add users

Ajoutez les adresses Gmail autorisées

👉 Sans cela, vous aurez une erreur :
Error 403: access_denied

# Créer les identifiants OAuth 2.0

Allez dans API et services > Identifiants

Cliquez sur Créer des identifiants

Sélectionnez ID client OAuth

Type d’application : Application Web

Configuration requise
Origines JavaScript autorisées
http://localhost:5173


Ce sont les domaines autorisés à initier la requête OAuth.

URI de redirection autorisés
http://localhost:3000/google/oauth2callback


C’est l’URL vers laquelle Google redirige l’utilisateur après authentification.

**Le serveur OAuth 2.0 y envoie :**

un authorization code

ou directement un access token (selon le flow utilisé)


# Fonctionnement du Flow OAuth2

Lorsqu’une soumission de film est effectuée :

Le backend vérifie si un youtube_token.json existe

Si aucun token valide n’est présent :

Le backend redirige automatiquement vers /google/auth

L’utilisateur est redirigé vers Google

Il accepte les permissions (scope YouTube Upload)

Google redirige vers :

http://localhost:3000/google/oauth2callback


Le backend échange le authorization_code contre :

access_token

refresh_token

Les tokens sont sauvegardés dans :

config/youtube_token.json
