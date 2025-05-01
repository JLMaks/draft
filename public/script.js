// === Inscription ===
document.getElementById('validerBtn').addEventListener('click', function () {
  const pseudo = document.getElementById('pseudo').value;
  const nomRP = document.getElementById('nomRP').value;

  if (pseudo && nomRP) {
    localStorage.setItem('pseudo', pseudo);
    localStorage.setItem('nomRP', nomRP);
    document.querySelector('.form-section').style.display = 'none';
    document.getElementById('validerBtn').style.display = 'none';
    document.querySelector('.menu-section').style.display = 'block';
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});

// === Créer une partie ===
document.getElementById('creerBtn').addEventListener('click', function () {
  const gameCode = generateGameCode();
  const gameData = {
    code: gameCode,
    creator: localStorage.getItem('pseudo'),
    players: []
  };

  // Sauvegarder la partie
  let existingGames = JSON.parse(localStorage.getItem('games')) || [];
  existingGames.push(gameData);
  localStorage.setItem('games', JSON.stringify(existingGames));
  localStorage.setItem('gameCode', gameCode); // 🔑 Stocke le code à utiliser dans game.html

  alert("Vous avez créé une partie avec le code : " + gameCode);
  window.location.href = 'game.html';
});

// === Rejoindre une partie ===
document.getElementById('rejoindreBtn').addEventListener('click', function () {
  document.querySelector('.menu-section').style.display = 'none';
  document.querySelector('.join-game-section').style.display = 'block';
  displayAvailableGames();
});

// === Afficher les parties ===
function displayAvailableGames() {
  const gamesList = document.getElementById('gamesList');
  gamesList.innerHTML = '';
  const existingGames = JSON.parse(localStorage.getItem('games')) || [];

  if (existingGames.length === 0) {
    gamesList.innerHTML = 'Aucune partie en cours.';
  } else {
    existingGames.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('game-item');
      gameItem.innerHTML = `Code : ${game.code} - Créée par : ${game.creator}`;

      const joinBtn = document.createElement('button');
      joinBtn.textContent = 'Rejoindre';
      joinBtn.addEventListener('click', () => joinGame(game.code));
      gameItem.appendChild(joinBtn);
      gamesList.appendChild(gameItem);
    });
  }
}

// === Générer un code aléatoire ===
function generateGameCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
document.getElementById('joinGameBtn').addEventListener('click', function() {
  // Récupère le code entré par l'utilisateur
  const gameCode = document.getElementById('gameCodeInput').value.trim();

  // Vérifie si le code est valide
  if (gameCode === "") {
    document.getElementById('error-message').textContent = "Veuillez entrer un code de partie.";
    document.getElementById('success-message').textContent = "";
  } else {
    // Vérifier si le code correspond à un code de partie existant
    const storedCode = localStorage.getItem('gameCode'); // Exemple : on récupère le code sauvegardé précédemment
    if (gameCode === storedCode) {
      document.getElementById('error-message').textContent = "";
      document.getElementById('success-message').textContent = "Vous avez rejoint la partie avec le code : " + gameCode;
      // Tu peux aussi rediriger vers la page du jeu ici
      // window.location.href = 'game.html'; // Rediriger vers la page de jeu
    } else {
      document.getElementById('error-message').textContent = "Code de partie incorrect. Essayez à nouveau.";
      document.getElementById('success-message').textContent = "";
    }
  }
});
