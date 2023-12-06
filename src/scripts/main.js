'use strict';

const app = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const loserMessage = document.querySelector('.message-lose');
const gameScoreElement = document.querySelector('.game-score');

const gridSize = 4;
let gameGrid = [];
let score = 0;

let click = false;

function startGame() {
  if (!click) {
    gameGrid = Array.from({ length: gridSize * gridSize }, () => 0);
    app.classList.remove('start');
    app.classList.add('restart');
    app.textContent = 'Restart';

    addRandomNumber();
    addRandomNumber();
    updateGrid();
  }
  click = true;

  if (click) {
    startMessage.classList.add('hidden');
  }
}

function addRandomNumber() {
  const availCell = gameGrid.reduce((acc, cell, index) => {
    if (cell === 0) {
      acc.push(index);
    }

    return acc;
  }, []);

  if (availCell.length >= 1) {
    const index = availCell[Math.floor(Math.random() * availCell.length)];

    gameGrid[index] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateGrid() {
  cells.forEach((cell, index) => {
    cell.textContent = gameGrid[index] === 0 ? '' : gameGrid[index];
    cell.className = `field-cell field-cell--${gameGrid[index]}`;
  });

  checkWin();
}

function moveLeft(gameGrid, testMode = false) {
  let moved = false;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 1; j < gridSize; j++) {
      let currentIndex = i * gridSize + j;

      while (currentIndex % gridSize !== 0) {
        const prevIndex = currentIndex - 1;

        if (gameGrid[currentIndex] !== 0) {
          if (gameGrid[prevIndex] === 0) {
            gameGrid[prevIndex] = gameGrid[currentIndex];
            gameGrid[currentIndex] = 0;
            currentIndex = prevIndex;
            moved = true;
          } else if (gameGrid[prevIndex] === gameGrid[currentIndex]) {
            score += gameGrid[prevIndex];
            gameGrid[prevIndex] *= 2;
            gameGrid[currentIndex] = 0;
            moved = true;
            break;
          } else {
            break;
          }
        }
        currentIndex = prevIndex;
      }
    }
  }

  if (!testMode) {
    if (moved) {
      addRandomNumber();
      updateGrid();
      gameScoreElement.textContent = score;
    }
    checkAvailableMoves();
  }

  return moved;
}

function moveRight(gameGrid, testMode = false) {
  let moved = false;

  for (let i = 0; i < gridSize; i++) {
    for (let j = gridSize - 2; j >= 0; j--) {
      let currentIndex = i * gridSize + j;

      while ((currentIndex + 1) % gridSize !== 0) {
        const nextIndex = currentIndex + 1;

        if (gameGrid[currentIndex] !== 0) {
          if (gameGrid[nextIndex] === 0) {
            gameGrid[nextIndex] = gameGrid[currentIndex];
            gameGrid[currentIndex] = 0;
            currentIndex = nextIndex;
            moved = true;
          } else if (gameGrid[nextIndex] === gameGrid[currentIndex]) {
            score += gameGrid[nextIndex];
            gameGrid[nextIndex] *= 2;

            gameGrid[currentIndex] = 0;
            moved = true;
            break;
          } else {
            break;
          }
        }
        currentIndex = nextIndex;
      }
    }
  }

  if (!testMode) {
    if (moved) {
      addRandomNumber();
      updateGrid();
      gameScoreElement.textContent = score;
    }
    checkAvailableMoves();
  }

  return moved;
}

function moveUp(gameGrid, testMode = false) {
  let moved = false;

  for (let i = 1; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let currentIndex = i * gridSize + j;

      while (currentIndex - gridSize >= 0) {
        const upIndex = currentIndex - gridSize;

        if (gameGrid[currentIndex] !== 0) {
          if (gameGrid[upIndex] === 0) {
            gameGrid[upIndex] = gameGrid[currentIndex];
            gameGrid[currentIndex] = 0;
            currentIndex = upIndex;
            moved = true;
          } else if (gameGrid[upIndex] === gameGrid[currentIndex]) {
            score += gameGrid[upIndex];
            gameGrid[upIndex] *= 2;
            gameGrid[currentIndex] = 0;
            moved = true;
            break;
          } else {
            break;
          }
        }
        currentIndex = upIndex;
      }
    }
  }

  if (!testMode) {
    if (moved) {
      addRandomNumber();
      updateGrid();
      gameScoreElement.textContent = score;
    }
    checkAvailableMoves();
  }

  return moved;
}

function moveDown(gameGrid, testMode = false) {
  let moved = false;

  for (let i = gridSize - 2; i >= 0; i--) {
    for (let j = 0; j < gridSize; j++) {
      let currentIndex = i * gridSize + j;

      while (currentIndex + gridSize <= gridSize * gridSize) {
        const downIndex = currentIndex + gridSize;

        if (gameGrid[currentIndex] !== 0) {
          if (gameGrid[downIndex] === 0) {
            gameGrid[downIndex] = gameGrid[currentIndex];
            gameGrid[currentIndex] = 0;
            currentIndex = downIndex;
            moved = true;
          } else if (gameGrid[downIndex] === gameGrid[currentIndex]) {
            score += gameGrid[downIndex];
            gameGrid[downIndex] *= 2;
            gameGrid[currentIndex] = 0;
            moved = true;
            break;
          } else {
            break;
          }
        }
        currentIndex = downIndex;
      }
    }
  }

  if (!testMode) {
    if (moved) {
      addRandomNumber();
      updateGrid();
      gameScoreElement.textContent = score;
    }
    checkAvailableMoves();
  }

  return moved;
}

function restartGame() {
  click = false;

  loserMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');

  cells.forEach((cell, index) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  startGame();
}

function checkAvailableMoves() {
  if (!moveLeft([ ...gameGrid ], true) && !moveRight([ ...gameGrid ], true)
    && !moveUp([ ...gameGrid ], true) && !moveDown([ ...gameGrid ], true)) {
    loserMessage.classList.remove('hidden');
  }
}

function checkWin() {
  for (let i = 0; i < gameGrid.length; i++) {
    if (gameGrid[i] === 2048) {
      const winMessage = document.querySelector('.message-win');

      winMessage.classList.remove('hidden');
      break;
    }
  }
}

app.addEventListener('click', e => {
  if (e.target.classList.contains('restart')) {
    restartGame();
  } else if (e.target.classList.contains('start')) {
    startGame();
  }
});

document.addEventListener('keydown', (e) => {
  if (click) {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft(gameGrid);
        break;
      case 'ArrowRight':
        moveRight(gameGrid);
        break;
      case 'ArrowUp':
        moveUp(gameGrid);
        break;
      case 'ArrowDown':
        moveDown(gameGrid);
        break;
      default:
        break;
    }
  }
});
