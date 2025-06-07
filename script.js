let players = [];
let roundMultiplier = 1; // Default multiplier

function createNameInputs() {
  const count = parseInt(document.getElementById('playerCount').value);
  if (isNaN(count) || count < 1) {
    alert('Please enter a valid number of players (at least 1)');
    return;
  }
  const container = document.getElementById('namesContainer');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <label>Player ${i + 1} Name: </label>
      <input type="text" id="playerName${i}" placeholder="Player ${i + 1}" required/>
      <br/>
    `;
  }
  document.getElementById('nameInputs').classList.remove('hidden');
  document.getElementById('scoreTable').innerHTML = '';
  document.getElementById('scoreboard').innerHTML = '';
}

function generateTable() {
  // Get player names
  players = [];
  const count = parseInt(document.getElementById('playerCount').value);
  for (let i = 0; i < count; i++) {
    const name = document.getElementById(`playerName${i}`).value.trim();
    if (!name) {
      alert('Please fill in all player names.');
      return;
    }
    players.push(name);
  }

  // Reset multiplier to default 1 on each generation
  roundMultiplier = 1;

  const tableDiv = document.getElementById('scoreTable');

  // Build the table HTML
  let html = `<div class="table-wrapper"><table><thead><tr>`;
  html += `<th>Player</th>`;
  for (let r = 1; r <= 5; r++) {
    html += `<th>Round ${r}</th>`;
  }
  html += `<th>Total</th>`;
  html += `</tr></thead><tbody>`;

  players.forEach((player, idx) => {
    html += `<tr><td>${player}</td>`;
    for (let r = 1; r <= 5; r++) {
      html += `<td><input type="number" min="0" value="0" oninput="calculateTotal(${idx})" id="score-${idx}-${r}"></td>`;
    }
    html += `<td><input type="number" readonly id="total-${idx}" value="0"></td></tr>`;
  });

  // Multiplier row with dropdown inside cell (6,1)
  html += `<tr><td colspan="7" style="text-align:left;">
    Round 5 points multiplier: 
    <select id="multiplierSelect" onchange="updateMultiplierAndRecalc()">
      <option value="1" selected>Normal (1x)</option>
      <option value="2">Double (2x)</option>
      <option value="4">Quadruple (4x)</option>
    </select>
  </td></tr>`;

  html += `</tbody></table></div>`;

  tableDiv.innerHTML = html;
  document.getElementById('scoreboard').innerHTML = '';
  calculateAllTotals();
}

function calculateTotal(playerIndex) {
  let sum = 0;
  for (let r = 1; r <= 4; r++) {
    const val = parseInt(document.getElementById(`score-${playerIndex}-${r}`).value) || 0;
    sum += val;
  }
  // round 5 with multiplier
  const val5 = parseInt(document.getElementById(`score-${playerIndex}-5`).value) || 0;
  sum += val5 * roundMultiplier;

  document.getElementById(`total-${playerIndex}`).value = sum;
}

function calculateAllTotals() {
  for (let i = 0; i < players.length; i++) {
    calculateTotal(i);
  }
}

function updateMultiplierAndRecalc() {
  const select = document.getElementById('multiplierSelect');
  roundMultiplier = parseInt(select.value);
  calculateAllTotals();
}

function showScoreboard() {
  calculateAllTotals();

  // Gather totals with player names
  const scores = players.map((p, i) => {
    return {
      name: p,
      total: parseInt(document.getElementById(`total-${i}`).value) || 0,
    };
  });

  // Sort from least to greatest points
  scores.sort((a, b) => a.total - b.total);

  let html = `<h3>Scoreboard (Least points → Highest points)</h3><ol>`;
  scores.forEach(s => {
    html += `<li>${s.name}: ${s.total} points</li>`;
  });
  html += '</ol>';

  document.getElementById('scoreboard').innerHTML = html;
}