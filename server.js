// Importation du module Express
const express = require('express');
const app = express();

// Port d'écoute : Render fournit un port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Middleware (optionnel) pour servir des fichiers statiques depuis un dossier "public"
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
  res.send('Bienvenue sur mon serveur Node.js déployé avec Render !');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
