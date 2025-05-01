// Import des bibliothèques nécessaires
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialisation de l'application Express et du serveur HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Dossier public pour les fichiers statiques (html, css, js)
app.use(express.static('public'));

// Liste des parties (chaque partie a un code et une liste de joueurs)
let parties = {};

// Quand un client se connecte
io.on('connection', (socket) => {
  console.log('Un joueur est connecté');

  // Créer une partie
  socket.on('creerPartie', (data) => {
    const { pseudo, nomRP } = data;
    const codePartie = generateCode();

    parties[codePartie] = {
      joueurs: [{ pseudo, nomRP, id: socket.id }],
      tour: 0
    };

    socket.join(codePartie);

    // Envoie du code de la partie à l'utilisateur qui l'a créé
    socket.emit('partieCreée', { codePartie });
    console.log(`Partie créée avec le code ${codePartie}`);
  });

  // Rejoindre une partie
  socket.on('rejoindrePartie', (data) => {
    const { codePartie, pseudo, nomRP } = data;

    if (parties[codePartie]) {
      parties[codePartie].joueurs.push({ pseudo, nomRP, id: socket.id });
      socket.join(codePartie);

      socket.emit('partieRejointe', { codePartie });

      io.to(codePartie).emit('message', `${pseudo} a rejoint la partie !`);
      console.log(`${pseudo} a rejoint la partie ${codePartie}`);
    } else {
      socket.emit('erreur', { message: "Partie introuvable avec ce code !" });
    }
  });

  // Quand un joueur quitte
  socket.on('disconnect', () => {
    for (const code in parties) {
      let party = parties[code];
      party.joueurs = party.joueurs.filter(joueur => joueur.id !== socket.id);
      if (party.joueurs.length === 0) {
        delete parties[code]; // Supprimer la partie si tous les joueurs partent
      }
    }
    console.log('Un joueur a quitté');
  });
});

// Fonction pour générer un code de partie aléatoire
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Lancer le serveur sur le port 3000
server.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
