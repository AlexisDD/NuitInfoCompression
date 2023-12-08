# Nuit de l'info 2023 - Défi compression d'images et de vidéos

L'objectif de ce défi est de creér une API REST permettant de compresser des images et des vidéos. 

Nous avons intégré cette API dans notre application web pour le défi principal de la nuit de l'info, certains composants ne concernent donc pas ce défi (MongoDB, Authentification, etc.). Une version en ligne de l'application est disponible à l'adresse suivante : http://nuitinfo.alexisdesaintdenis.fr:8081/.

## Composants

Pour comprendre le contenu du répertoire, l'application est séparée en 3 composants :
* **Base de données** : Base de données NoSQL [MongoDB](https://www.mongodb.com/) pour stocker les utilisateurs.
* **Backend** : API REST développée avec le framework [Express.js](https://expressjs.com/) pour Node.js.
* **Front** : Application web développée avec le framework [Vue.js](https://vuejs.org/).

## API de compression

### Documentation

Il faut au préalable installer [FFmpeg](https://ffmpeg.org/) sur la machine hôte pour pouvoir utiliser l'API de compression. Il est possible de télécharger des binaires précompilés sur le site officiel.

L'API de compression est accessible à l'adresse `/compression/compress` du composant Backend. Il est exposé par défaut sur le port 3000.

Entrée :
```json
{
    "url": "http://localhost:8080/test.mp4",
    "size": "10MB"
}
```

Attention : certains liens vers des images ou vidéos ne fonctionnent pas car ils nécessitent l'acceptation des cookies et l'activation du JavaScript pour accéder à la ressource. C'est le cas du lien donné dans le sujet vers le site https://www.moselle.cci.fr.

Sortie :
```json
{
    "compressed": "http://localhost:3000/images/video-compressed.mp4",
    "originalSize": 10000000,
    "originalDimensions": {
        "width": 1920,
        "height": 1080
    },
    "originalFormat": "mp4",
    "compressedSize": 1000000,
    "compressedDimensions": {
        "width": 1920,
        "height": 1080
    },
    "compressedFormat": "mp4 (AV1 codec)"
}
```

### Fonctionnement

Vous retrouverez le code de l'API dans le fichier `src/controllers/compression_controller.js` du composant Backend.

Nous avons utilisé deux outils différents pour la compression des images et des vidéos.

#### Images

Pour les images, nous avons utilisé [Sharp](https://sharp.pixelplumbing.com/) qui est une librairie Node.js permettant de manipuler des images. Les images sont compressées au format AVIF (AV1 Image File Format), ce format est un format ouvert et libre de droits qui est parmi les plus performants en terme de compression.

Nous sommes satisfaits des résultats obtenus pour les images, la compression est rapide et le taux de compression est assez élevé.

#### Vidéos

Pour les vidéos, nous avons utilisé [FFmpeg](https://ffmpeg.org/) qui est un logiciel libre permettant de manipuler des vidéos. Les vidéos sont compressées au format AV1 (AOMedia Video 1). L'avantage de ce format est qu'il permet d'obtenir des vidéos de très bonne qualité avec un taux de compression très élevé. 

Cependant, il est assez gourmand en ressources et par conséquent, la compression peut prendre un certain temps. Pendant nos tests, la compression d'une vidéo de 110MB a pris environ 8 minutes, ce qui aurait pu être amélioré avec un peu plus de temps.

#### Choix de la taille maximale

L'API permet de spécifier la taille maximale désirée pour la compression. Cependant, il est difficile de déterminer la taille finale de la vidéo compressée à l'avance. Nous avons donc choisi de calculer un ratio de compression à partir de la taille de la vidéo originale et de la taille maximale désirée. Ce ratio sert ensuite à controler les paramètres de qualité des librairies de compression.

Par exemple, si la taille maximale désirée est de 10MB et que la vidéo originale fait 100MB, le ratio de compression sera de 0.1. Cela signifie que la vidéo compressée devra faire 10% de la taille de la vidéo originale. 

## Interface utilisateur

Dans le composant Front, vous retrouverez le code de l'interface utilisateur dans le dossier `src/views/CompressionView.vue`.
La page est accessible à l'adresse `/compression` du composant Front et communique avec l'API de compression du composant Backend.

## Installation

### Docker

Il est plus simple de lancer le projet avec [Docker](https://www.docker.com/). Pour cela, il faut tout d'abord installer Docker et Docker Compose (inclus dans Docker Desktop sur Windows).

Le fichier `docker-compose.yml` contient la configuration des conteneurs. L'avantage de Docker est qu'il permet de lancer tous les composants en une seule commande et sans avoir à installer les dépendances séparément.

Ensuite, il faut construire les images Docker :

```bash
docker-compose build
```

Et enfin, lancer les conteneurs :

```bash
docker-compose up
```

Ensuite, l'application est automatiquement déployée sur les ports suivants:
* **Front** : http://localhost/
* **Backend** : http://localhost:3000/


### Manuellement

Si vous ne souhaitez pas utiliser Docker, vous pouvez installer les composants manuellement. L'installation manuelle est plus longue mais permet d'utiliser les ressources GPU de la machine hôte pour la compression des vidéos.

1. Installer [Node.js](https://nodejs.org/en/)
2. Installer [FFmpeg](https://ffmpeg.org/)
3. Installer les dépendances du composant Backend :
    ```bash
    cd backend
    npm install
    ```
4. Installer les dépendances du composant Front :
    ```bash
    cd frontend
    npm install
    ```
5. Lancer le composant Backend :
    ```bash
    cd backend
    npm run start
    ```
6. Lancer le composant Front :
    ```bash
    cd frontend
    npm run serve
    ```

Ensuite, l'application est accessible à l'adresse http://localhost/.
