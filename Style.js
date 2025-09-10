const boardEl = document.getElementById('xox-board');
const statusEl = document.getElementById('xox-status');
const resetBtn = document.getElementById('xox-reset');
const modeRadios = document.querySelectorAll('input[name="xox-mode"]');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let vsComputer = false;

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'xox-cell';
    cellDiv.textContent = cell ? cell : '';
    cellDiv.addEventListener('click', () => handleCellClick(idx));
    boardEl.appendChild(cellDiv);
  });
}

function handleCellClick(idx) {
  if (!gameActive || board[idx]) return;
  board[idx] = currentPlayer;
  renderBoard();
  if (checkWin(currentPlayer)) {
    statusEl.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    setTimeout(resetGame, 2000);
    return;
  } else if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (vsComputer && currentPlayer === 'O' && gameActive) {
    statusEl.textContent = "Computer's turn";
    setTimeout(computerMove, 400);
  } else {
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function computerMove() {
  // Simple AI: pick random empty cell
  const emptyCells = board.map((cell, i) => cell ? null : i).filter(i => i !== null);
  if (emptyCells.length === 0) return;
  const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[move] = 'O';
  renderBoard();
  if (checkWin('O')) {
    statusEl.textContent = `Computer wins!`;
    gameActive = false;
    setTimeout(resetGame, 2000);
    return;
  } else if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  currentPlayer = 'X';
  statusEl.textContent = `Player X's turn`;
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(idx => board[idx] === player));
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = vsComputer ? `Player X's turn` : `Player X's turn`;
  renderBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', e => {
    vsComputer = e.target.value === 'computer';
    resetGame();
  });
});

resetBtn.addEventListener('click', resetGame);

// Initial setup
vsComputer = document.querySelector('input[name="xox-mode"]:checked').value === 'computer';
renderBoard();
statusEl.textContent = `Player X's turn`;
