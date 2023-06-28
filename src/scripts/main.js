'use strict';

// Game state variables
let gameGrid = [];
let score = 0;
let gameOver = false;
let win = false;

// DOM elements
const button = document.querySelector('button.button');
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// Start/Restart game
function startGame() {
  // Reset game state
  gameGrid = [];
  score = 0;
  gameOver = false;
  win = false;

  // Generate initial cells
  generateInitialCells();

  // Set up event listener for keyboard input
  document.addEventListener('keydown', handleKeyDown);

  // Update UI
  updateUI();
}

function resetGame() {
  // button.classList.replace('restart', 'start');
  // button.innerText = 'Start';
  // messageStart.classList.remove('hidden');
  // messageStart.hidden = false;

  gameGrid = [];
  score = 0;
  gameOver = false;
  win = false;

  // for (let i = 0; i < 4; i++) {
  //   gameGrid[i] = [];

  //   for (let j = 0; j < 4; j++) {
  //     gameGrid[i][j] = null;
  //   }
  // }

  generateInitialCells();

  updateUI();

  // messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

// Generate initial cells
function generateInitialCells() {
  for (let i = 0; i < 4; i++) {
    gameGrid[i] = [];

    for (let j = 0; j < 4; j++) {
      gameGrid[i][j] = null;
    }
  }

  generateNewCell();
  generateNewCell();
}

// Generate new cell (2 or 4)
function generateNewCell() {
  const emptyCells = getEmptyCells();

  if (emptyCells.length === 0) {
    // No empty cells, game over
    gameOver = true;

    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  // Randomly choose 2 or 4 with a 10% probability for 4
  const newValue = Math.random() < 0.9 ? 2 : 4;

  // Update game grid and cell values
  gameGrid[randomCell.row][randomCell.col] = newValue;
}

// Handle keyboard input
function handleKeyDown(e) {
  switch (e.key) {
    case 'ArrowUp':
      moveCellsUp();
      break;
    case 'ArrowDown':
      moveCellsDown();
      break;
    case 'ArrowLeft':
      moveCellsLeft();
      break;
    case 'ArrowRight':
      moveCellsRight();
      break;
  }

  // Update UI
  updateUI();
}

// Move cells up
function moveCellsUp() {
  let moved = false;

  // Move cells up logic
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (gameGrid[row][col] !== null) {
        let newRow = row;

        while (newRow > 0
          && (gameGrid[newRow - 1][col] === null
            || gameGrid[newRow - 1][col] === gameGrid[row][col])) {
          if (gameGrid[newRow - 1][col] === gameGrid[row][col]) {
            // Merge cells
            gameGrid[newRow - 1][col] *= 2;
            score += gameGrid[newRow - 1][col];
            gameGrid[row][col] = null;
            moved = true;

            if (gameGrid[newRow - 1][col] === 2048) {
              win = true;
            }
            break;
          }
          newRow--;
        }

        if (newRow !== row) {
          // Move cell
          gameGrid[newRow][col] = gameGrid[row][col];
          gameGrid[row][col] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNewCell();
    generateNewCell();
    updateUI();
  }
}

// Move cells down
function moveCellsDown() {
  let moved = false;

  // Move cells down logic
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (gameGrid[row][col] !== null) {
        let newRow = row;

        while (newRow < 3
          && (gameGrid[newRow + 1][col] === null
            || gameGrid[newRow + 1][col] === gameGrid[row][col])) {
          if (gameGrid[newRow + 1][col] === gameGrid[row][col]) {
            // Merge cells
            gameGrid[newRow + 1][col] *= 2;
            score += gameGrid[newRow + 1][col];
            gameGrid[row][col] = null;
            moved = true;

            if (gameGrid[newRow + 1][col] === 2048) {
              win = true;
            }
            break;
          }
          newRow++;
        }

        if (newRow !== row) {
          // Move cell
          gameGrid[newRow][col] = gameGrid[row][col];
          gameGrid[row][col] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNewCell();
    generateNewCell();
    updateUI();
  }
}

// Move cells left
function moveCellsLeft() {
  let moved = false;

  // Move cells left logic
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (gameGrid[row][col] !== null) {
        let newCol = col;

        while (newCol > 0
          && (gameGrid[row][newCol - 1] === null
            || gameGrid[row][newCol - 1] === gameGrid[row][col])) {
          if (gameGrid[row][newCol - 1] === gameGrid[row][col]) {
            // Merge cells
            gameGrid[row][newCol - 1] *= 2;
            score += gameGrid[row][newCol - 1];
            gameGrid[row][col] = null;
            moved = true;

            if (gameGrid[row][newCol - 1] === 2048) {
              win = true;
            }
            break;
          }
          newCol--;
        }

        if (newCol !== col) {
          // Move cell
          gameGrid[row][newCol] = gameGrid[row][col];
          gameGrid[row][col] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNewCell();
    generateNewCell();
    updateUI();
  }
}

// Move cells right
function moveCellsRight() {
  let moved = false;

  // Move cells right logic
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (gameGrid[row][col] !== null) {
        let newCol = col;

        while (newCol < 3
          && (gameGrid[row][newCol + 1] === null
            || gameGrid[row][newCol + 1] === gameGrid[row][col])) {
          if (gameGrid[row][newCol + 1] === gameGrid[row][col]) {
            // Merge cells
            gameGrid[row][newCol + 1] *= 2;
            score += gameGrid[row][newCol + 1];
            gameGrid[row][col] = null;
            moved = true;

            if (gameGrid[row][newCol + 1] === 2048) {
              win = true;
            }
            break;
          }
          newCol++;
        }

        if (newCol !== col) {
          // Move cell
          gameGrid[row][newCol] = gameGrid[row][col];
          gameGrid[row][col] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNewCell();
    generateNewCell();
    updateUI();
  }
}

// Update the UI
function updateUI() {
  // Update score
  scoreDisplay.textContent = score;

  // Update cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = gameGrid[row][col];
      const cellElement
        = document.querySelector(`.field-row:nth-child(${row + 1})
      .field-cell:nth-child(${col + 1})`);

      if (cell === null) {
        cellElement.textContent = '';
        cellElement.className = "field-cell";
      } else {
        cellElement.textContent = cell;
        cellElement.className = `field-cell field-cell--${cell}`;
      }
    }
  }

  // Show win or game over message
  if (win) {
    messageWin.classList.remove('hidden');
  } else if (!hasAvailableMoves()) {
    messageLose.classList.remove('hidden');
  }
}

// Check if there are available moves
function hasAvailableMoves() {
  // Check if there are empty cells
  if (getEmptyCells().length > 0) {
    return true;
  }

  // Check if any adjacent cells have the same value
  const directions = [
    {
      dx: -1, dy: 0,
    },
    {
      dx: 1, dy: 0,
    },
    {
      dx: 0, dy: -1,
    },
    {
      dx: 0, dy: 1,
    },
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const currentCell = gameGrid[i][j];

      for (const direction of directions) {
        const ni = i + direction.dx;
        const nj = j + direction.dy;

        if (ni >= 0 && ni < 4
          && nj >= 0 && nj < 4 && gameGrid[ni][nj] === currentCell) {
          return true;
        }
      }
    }
  }

  return false;
}

// Get empty cells
function getEmptyCells() {
  const emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (gameGrid[i][j] === null) {
        emptyCells.push({
          row: i,
          col: j,
        });
      }
    }
  }

  return emptyCells;
}

button.addEventListener('click', (e) => {
  if (button.innerText === 'Start') {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    resetGame();

    return;
  }

  startGame();
});
