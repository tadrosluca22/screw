let playerCount = 0;

function createNameInputs() {
  playerCount = parseInt(document.getElementById('playerCount').value);
  if (!playerCount || playerCount <= 0) return;

  const container = document.getElementById('namesContainer');
  container.innerHTML = '';
  for (let i = 0; i < playerCount; i++) {
    container.innerHTML += `<input type="text" placeholder="Player ${i + 1}" id="playerName${i}"><br>`;
  }

  document.getElementById('nameInputs').classList.remove('hidden');
}

function generateTable() {
  const names = [];
  for (let i = 0; i < playerCount; i++) {
    const name = document.getElementById(`playerName${i}`).value.trim();
    if (!name) {
      alert('Please enter all player names.');
      return;
    }
    names.push(name);
  }

  const tableDiv = document.getElementById('scoreTable');
  let html = `<table><tr><th>Player</th>`;
  for (let round = 1; round <= 5; round++) {
    html += `<th>Round ${round}</th>`;
  }
  html += `<th>Total</th></tr>`;

  names.forEach((name, idx) => {
    html += `<tr><td>${name}</td>`;
    for (let r = 0; r < 5; r++) {
      html += `<td><input type="number" min="0" value="0" oninput="calculateTotal(${idx})" id="score-${idx}-${r}"></td>`;
    }
    html += `<td id="total-${idx}">0</td></tr>`;
  });

  html += `</table>`;
  tableDiv.innerHTML = html;

  // Clear scoreboard when table is regenerated
  document.getElementById('scoreboard').innerHTML = '';
}

function calculateTotal(playerIndex) {
  let sum = 0;
  for (let r = 0; r < 5; r++) {
    const val = parseInt(document.getElementById(`score-${playerIndex}-${r}`).value) || 0;
    sum += val;
  }
  document.getElementById(`total-${playerIndex}`).textContent = sum;
}

function showScoreboard() {
  const scores = [];

  for (let i = 0; i < playerCount; i++) {
    const name = document.getElementById(`score-${i}-0`)?.parentNode?.parentNode?.children[0]?.textContent;
    const total = parseInt(document.getElementById(`total-${i}`).textContent) || 0;
    scores.push({ name, total });
  }

  // Sort scores from least to most
  scores.sort((a, b) => a.total - b.total);

  // Display scoreboard
  let html = "<h3>Scoreboard (Least to Most Points)</h3><ol>";
  scores.forEach(player => {
    html += `<li>${player.name}: ${player.total} points</li>`;
  });
  html += "</ol>";

  document.getElementById("scoreboard").innerHTML = html;
}
