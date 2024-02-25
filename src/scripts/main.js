'use strict';

// write your code here
let grid, score, gameStarted;

document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('restart').addEventListener('click', initGame);
document.addEventListener('keydown', handleInput);

function initGame() {
  grid = createEmptyGrid();
  score = 0;
  gameStarted = false;
  updateScore();
  addRandomTile();
  addRandomTile();
  drawGrid();
  hideGameOverMessage();
}

function createEmptyGrid() {
  return [...Array(4)].map(() => Array(4).fill(0));
}

function addRandomTile() {
  const emptyTiles = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyTiles.push({
          i, j,
        });
      }
    }
  }

  if (emptyTiles.length) {
    const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    grid[i][j] = Math.random() > 0.9 ? 4 : 2;
  }
}

function drawGrid() {
  const gridContainer = document.getElementById('grid-container');

  gridContainer.innerHTML = '';

  grid.forEach((row, i) => {
    row.forEach((value, j) => {
      const tile = document.createElement('div');

      tile.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
      tile.textContent = value || '';
      gridContainer.appendChild(tile);
    });
  });

  if (isGameOver()) {
    if (isGameWon()) {
      showGameWinMessage();
    } else {
      showGameOverMessage();
    }
  }
}

function handleInput(e) {
  if (isGameOver()) {
    return;
  }

  const key = e.key;

  if (key === 'ArrowUp'
    || key === 'ArrowDown'
    || key === 'ArrowLeft'
    || key === 'ArrowRight'
  ) {
    if (!gameStarted) {
      gameStarted = true;
      showButtonRestart();
      hideStartGame();
    }

    const oldGrid = JSON.stringify(grid);

    moveTiles(key);
    mergeTiles(key);
    moveTiles(key);

    if (oldGrid !== JSON.stringify(grid)) {
      addRandomTile();
    }

    drawGrid();
    updateScore();
  }
}

function moveTiles(direction) {
  const isVertical = direction === 'ArrowUp' || direction === 'ArrowDown';
  const isForward = direction === 'ArrowRight' || direction === 'ArrowDown';

  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 4; j++) {
      const cell = isVertical ? grid[j][i] : grid[i][j];

      if (cell) {
        row.push(cell);
      }
    }

    const missing = 4 - row.length;
    const zeros = Array(missing).fill(0);

    row = isForward ? zeros.concat(row) : row.concat(zeros);

    for (let j = 0; j < 4; j++) {
      if (isVertical) {
        grid[j][i] = row[j];
      } else {
        grid[i][j] = row[j];
      }
    }
  }
}

function mergeTiles(direction) {
  const isVertical = direction === 'ArrowUp' || direction === 'ArrowDown';
  const isForward = direction === 'ArrowRight' || direction === 'ArrowDown';

  for (let i = 0; i < 4; i++) {
    for (let j = isForward ? 3 : 0; isForward ? j > 0 : j < 3; isForward ? j-- : j++) {
      const current = isVertical ? grid[j][i] : grid[i][j];
      const next = isVertical ? grid[isForward ? j - 1 : j + 1][i] : grid[i][isForward ? j - 1 : j + 1];

      if (current !== 0 && current === next) {
        const mergedTile = current * 2;

        isVertical ? grid[j][i] = mergedTile : grid[i][j] = mergedTile;
        isVertical ? grid[isForward ? j - 1 : j + 1][i] = 0 : grid[i][isForward ? j - 1 : j + 1] = 0;
        score += mergedTile;
        break;
      }
    }
  }
}

function updateScore() {
  document.getElementById('game-score').textContent = 'Score: ' + score;
}

function isGameOver() {
  return isGridFull() && !canMakeMove();
}

function isGridFull() {
  return grid.every(row => row.every(cell => cell !== 0));
}

function canMakeMove() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];

      if (value !== 0) {
        if (i < 3 && value === grid[i + 1][j]) {
          return true;
        }

        if (j < 3 && value === grid[i][j + 1]) {
          return true;
        }
      }
    }
  }

  return false;
}

function isGameWon() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function showGameOverMessage() {
  const gameOverMessage = document.getElementById('game-over');

  gameOverMessage.style.cssText = 'display: block;';
}

function showButtonRestart() {
  const showButton = document.getElementById('restart');
  const hiddenButton = document.getElementById('new-game');

  showButton.style.cssText = 'display: block;';
  hiddenButton.style.cssText = 'display: none;';
}

function showGameWinMessage() {
  const gameWinMessage = document.getElementById('win');

  gameWinMessage.style.cssText = 'display: block;';
}

function hideGameOverMessage() {
  const gameOverMessage = document.getElementById('game-over');

  gameOverMessage.style.cssText = 'display: none;';
  initGame();
}

function hideStartGame() {
  const startGameMassage = document.getElementById('start');

  startGameMassage.style.cssText = 'display: none;';
}

initGame();
