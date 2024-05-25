
# What's in the Fridge

Bienvenue sur "What's in the Fridge" ! Cette plateforme vous aide à trouver de délicieuses recettes en fonction des ingrédients que vous avez déjà à la maison. Vous pouvez gérer votre frigo virtuel, explorer des recettes et partager vos commentaires avec la communauté.

## Table des matières

1. [Fonctionnalités](#fonctionnalités)
2. [Installation](#installation)
3. [Utilisation](#utilisation)
4. [API](#api)
5. [Structure des fichiers](#structure-des-fichiers)


## Fonctionnalités

- **Suggestions de recettes personnalisées :** Obtenez des recettes basées sur les ingrédients que vous avez.
- **Gestion des ingrédients :** Ajoutez et supprimez facilement des ingrédients de votre frigo virtuel.
- **Commentaires de la communauté :** Lisez et laissez des commentaires sur les recettes.
- **Interface utilisateur intuitive :** Facile à naviguer et à utiliser.

## Installation

### Prérequis
pour le coté client nous utilisons React et css pour le style, coté serveur nous utilisons Go.
l'api utilisé est spoonacular pour avoir les differentes recettes etc ... et on utilise CLOUDINARY pour stocker les images que l'utilisateurs veut upload.

- [Node.js]
- [npm]
- [Go]
- Un serveur MongoDB

### Étapes

1. Clonez ce dépôt :

\`\`\`bash
git clone https://stl.algo-prog.info/21311739/projet-pc3r-web-whatsinthefridge.git
cd whats-in-the-fridge
\`\`\`

2. Installez les dépendances pour le client et le serveur :

\`\`\`bash
cd client
npm install
cd ../server
go get ./...
\`\`\`

3. Configurez les variables d'environnement :

Créez un fichier `.env` à la racine du dossier `server` avec les informations suivantes :

4. Démarrez le serveur et le client :

\`\`\`bash
cd server
go run main.go
\`\`\`

Ouvrez un autre terminal pour démarrer le client :

\`\`\`bash
cd client
npm run start
\`\`\`

## Utilisation

### Naviguer dans l'application

1. **Accueil :** Page d'accueil avec un message de bienvenue et des boutons pour explorer les recettes ou ajouter des ingrédients.
2. **Explorer :** Trouvez des recettes en fonction des ingrédients disponibles.
3. **Profil :** Gérez votre frigo virtuel et consultez vos commentaires.
4. **À propos :** Apprenez-en plus sur comment utiliser le site et ses fonctionnalités.

### Gestion des ingrédients

- **Ajouter un ingrédient :** Accédez à la section Fridge de votre profil et ajoutez des ingrédients.
- **Supprimer un ingrédient :** Cliquez sur l'ingrédient dans la liste et appuyez sur le bouton "Supprimer".

### Rechercher des recettes

- **Exploration :** Utilisez la page "Explorer" pour trouver des recettes basées sur les ingrédients ajoutés dans votre frigo virtuel.
- **Suggestions :** Recevez des suggestions de recettes sur la page d'accueil, mises à jour quotidiennement.

## API
Nous utilisons l'API Spoonaculat APi, elle est très complète et propose beaucoup de possibilitées et de endpoints

## Structure des fichiers

\`\`\`plaintext
whats-in-the-fridge/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/
│   ├── main.go
│   └── ...
└── README.md
\`\`\`

