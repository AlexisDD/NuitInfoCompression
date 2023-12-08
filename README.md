# Nuit de l'info 2023

Template d'application web avec un système d'authentification pour la nuit de l'info 2023.
Une version en ligne est disponible à l'adresse suivante : http://nuitinfo.alexisdesaintdenis.fr

## Composants

L'application est séparée en 3 composants :
* **Base de données** : Base de données NoSQL [MongoDB](https://www.mongodb.com/) pour stocker les utilisateurs.
* **Backend** : API REST développée avec le framework [Express.js](https://expressjs.com/) pour Node.js.
* **Front** : Application web développée avec le framework [Vue.js](https://vuejs.org/).

## Installation

### Environnement de développement

Pour mettre en place l'environnement de développement, il faut tout d'abord installer [Node.js](https://nodejs.org/en/).

Ensuite, il faut installer les dépendances de chaque composant :

```bash
cd Backend
npm install
```

```bash
cd Frontend
npm install
```

L'exécution se fait avec la commande :

```bash
npm run dev
```

### Docker

Le projet peut être lancé avec [Docker](https://www.docker.com/). Pour cela, il faut tout d'abord installer Docker et Docker Compose (inclus dans Docker Desktop sur Windows).

Le fichier `docker-compose.yml` contient la configuration des conteneurs. L'avantage de Docker est qu'il permet de lancer tous les composants en une seule commande et sans avoir à installer les dépendances séparément (par exemple, MongoDB n'a pas besoin d'être installé sur la machine hôte).

Ensuite, il faut construire les images Docker :

```bash
docker-compose build
```

Et enfin, lancer les conteneurs :

```bash
docker-compose up
```