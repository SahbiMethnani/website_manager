# Gestionnaire de site web — FastAPI + React

Permet à un utilisateur de :
1. **Créer un template** de site web via un éditeur de blocs (Hero, Texte, Image, Galerie, CTA, Footer), avec prévisualisation live.
2. **Ou envoyer directement sa propre maquette** (HTML/CSS/JS zippé, export Figma, ou tout autre format UI/UX) par upload.
3. **Exporter** le résultat : téléchargement en `.zip` (index.html / style.css / script.js) ou **envoi par email** à la société, avec les coordonnées du client.

## Architecture

```
backend/            API FastAPI
  main.py           Endpoints (templates, upload, envoi email, téléchargement)
  generator.py      Génère le HTML/CSS/JS à partir du JSON de blocs
  email_service.py  Envoi SMTP avec pièce jointe
  store.py          Persistance JSON simple (à remplacer par une DB en prod)
  storage/          Templates, exports .zip, fichiers uploadés
frontend/           App React (Vite)
  src/App.jsx               Bascule entre "Créer un template" et "J'ai déjà une maquette"
  src/components/           Palette de blocs, Canvas, éditeur de propriétés, prévisualisation, export, upload
  src/blockDefinitions.js   Catalogue des types de blocs disponibles
```

## Lancer le back-end

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # puis renseigner COMPANY_EMAIL et les identifiants SMTP
uvicorn main:app --reload --port 8000
```

## Lancer le front-end

```bash
cd frontend
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173` et proxy les appels `/api/*` vers `http://localhost:8000`.

## Étendre le système

- **Ajouter un type de bloc** : ajouter une fonction `@block("mon_type")` dans `generator.py`, une entrée dans `blockDefinitions.js`, et un `case` dans `Preview.jsx`.
- **Base de données réelle** : remplacer `store.py` par un accès PostgreSQL/MongoDB (l'interface `save`/`load` reste identique).
- **Authentification** : ajouter un middleware FastAPI (ex. OAuth2/JWT) avant de brancher sur de vrais comptes clients.
- **Stockage des uploads/exports** : basculer de disque local vers S3/MinIO en production.
- **Formats supplémentaires** : le endpoint `/api/uploads` accepte n'importe quel fichier (zip HTML/CSS/JS, `.fig` exporté, PDF de maquette, etc.) — il est agnostique du format, seul l'email l'accompagne avec les infos du client.

## Sécurité en production
- Restreindre `allow_origins` dans le middleware CORS à votre domaine.
- Utiliser un mot de passe d'application SMTP (jamais le mot de passe principal).
- Limiter la taille des fichiers uploadés et scanner leur contenu si nécessaire.
