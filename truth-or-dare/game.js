let players = [];
let currentPlayerIndex = 0;
let difficulty = "easy";
let nsfwUnlocked = false;

document.getElementById("numPlayers").addEventListener("input", (e) => {
  const container = document.getElementById("playerInputs");
  container.innerHTML = "";
  const count = parseInt(e.target.value);
  for (let i = 1; i <= count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Player ${i} Name`;
    input.required = true;
    container.appendChild(input);
  }
});

document.getElementById("difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
  const nsfw = document.getElementById("nsfwWarning");
  if (difficulty === "extreme" && !nsfwUnlocked) {
    nsfw.style.display = "block";
  } else {
    nsfw.style.display = "none";
  }
});

document.getElementById("unlockNSFW").addEventListener("click", () => {
  nsfwUnlocked = true;
  document.getElementById("nsfwWarning").style.display = "none";
});

document.getElementById("startGame").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#playerInputs input");
  players = Array.from(inputs).map((input) => input.value.trim()).filter(name => name !== "");
  if (players.length < 2) {
    alert("At least 2 players required!");
    return;
  }
  if (difficulty === "extreme" && !nsfwUnlocked) {
    alert("You need to unlock NSFW mode first!");
    return;
  }

  document.querySelector(".setup").classList.add("hidden");
  document.getElementById("gameSection").classList.remove("hidden");
  nextTurn();
});

function nextTurn() {
  document.getElementById("postPrompt").classList.add("hidden");
  document.getElementById("promptDisplay").textContent = "";
  document.getElementById("punishmentDisplay").textContent = "";
  currentPlayerIndex = Math.floor(Math.random() * players.length);
  const player = players[currentPlayerIndex];
  document.getElementById("currentPlayer").textContent = `${player}'s turn!`;
}

function getRandomPrompt(type) {
  const set = prompts[difficulty][type];
  return set[Math.floor(Math.random() * set.length)];
}

document.getElementById("chooseTruth").addEventListener("click", () => {
  const prompt = getRandomPrompt("truths");
  document.getElementById("promptDisplay").textContent = "Truth: " + prompt;
  document.getElementById("postPrompt").classList.remove("hidden");
});

document.getElementById("chooseDare").addEventListener("click", () => {
  const prompt = getRandomPrompt("dares");
  document.getElementById("promptDisplay").textContent = "Dare: " + prompt;
  document.getElementById("postPrompt").classList.remove("hidden");
});

document.getElementById("didIt").addEventListener("click", () => {
  document.getElementById("postPrompt").classList.add("hidden");
  document.getElementById("punishmentDisplay").textContent = "✅ Respect.";
});

document.getElementById("skipIt").addEventListener("click", () => {
  const punishment = getRandomPrompt("dares"); // Punishment = random dare again
  document.getElementById("punishmentDisplay").textContent = "❌ Punishment: " + punishment;
  document.getElementById("postPrompt").classList.add("hidden");
});

document.getElementById("nextTurn").addEventListener("click", () => {
  nextTurn();
});
