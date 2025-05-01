// script.js

// Initialisation des pseudos (doivent être récupérés du localStorage)
const joueurs = JSON.parse(localStorage.getItem("joueurs")) || [];
const creator = localStorage.getItem("creator");
const players = [creator, ...joueurs];

// Mise à jour des pseudos sur la page
window.onload = function () {
  for (let i = 0; i < players.length; i++) {
    document.getElementById(`player${i+1}`).textContent = players[i];
  }

  // Préparer les cases de la draft
  const draftGrid = document.getElementById("draftGrid");
  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div");
    div.classList.add("draft-grid-item");
    div.innerHTML = `<span>abcde</span><div class="info">Info sur cette case</div>`;
    draftGrid.appendChild(div);
  }
};

// Tirage au sort
let isTirageEnCours = false;
let tirageInterval;
let currentPlayerIndex = 0;

// Fonction pour démarrer le tirage
document.getElementById('stopDrawBtn').addEventListener('click', function () {
  if (isTirageEnCours) {
    clearInterval(tirageInterval);
    document.getElementById('movingLine').textContent = `${players[currentPlayerIndex]} va commencer la draft !`;

    // Activer la draft pour ce joueur
    enableDraft(currentPlayerIndex);
    isTirageEnCours = false;
  } else {
    tirageInterval = setInterval(function () {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      document.getElementById('movingLine').textContent = players[currentPlayerIndex];
    }, 100); // Changer de joueur toutes les 100ms
    isTirageEnCours = true;
    document.getElementById('movingLine').textContent = 'Tirage en cours...';
  }
});

// Choisir une case
let caseSelectionnee = null;

document.querySelectorAll(".draft-grid-item").forEach((item, index) => {
  item.addEventListener("click", function () {
    if (!caseSelectionnee) {
      caseSelectionnee = item;
      caseSelectionnee.style.backgroundColor = "#f0e68c"; // Met en surbrillance la case sélectionnée
    }
  });
});

document.getElementById("chooseBtn").addEventListener("click", function () {
  if (caseSelectionnee) {
    caseSelectionnee.innerHTML = `${players[currentPlayerIndex]} a choisi!`;
    caseSelectionnee.style.backgroundColor = "#ddd";
    caseSelectionnee = null;

    // Passer au joueur suivant
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    document.getElementById('movingLine').textContent = `${players[currentPlayerIndex]}'s tour`;
  }
});

// Fonction pour activer la draft
function enableDraft(playerIndex) {
  document.getElementById('chooseBtn').disabled = false; // Activer le bouton "Choisir"
}
