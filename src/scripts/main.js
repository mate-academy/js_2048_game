'use strict';

const cells = document.querySelectorAll('.field-cell');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

let isGameOver = false;
let score = 0;
let gameBoard = [];

function initializeGame() {
  score = 0;

  gameBoard = Array.from({
    length: 4,
  }, () =>
    Array.from({
      length: 4,
    }, () => 0));
  isGameOver = false;
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');
  scoreDisplay.textContent = score;
}

function animateMergedCells(mergedCells) {
  mergedCells.forEach(cell => {
    cell.style.transform = 'scale(1.1)';

    setTimeout(() => {
      cell.style.transform = 'scale(1)';
    }, 500);
  });
}

function addRandomTile() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameBoard[row][col] === 0) {
        emptyCells.push({
          row,
          col,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell
    = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.9
      ? 2
      : 4;

    gameBoard[randomCell.row][randomCell.col] = randomValue;
  }
}

function checkGameOver() {
  let movesAvailable = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameBoard[row][col] === 0) {
        return false;
      }

      if (col < 3 && gameBoard[row][col]
         === gameBoard[row][col + 1]) {
        return false;
      }

      if (col < 3 && gameBoard[row][col]
        === 0) {
        movesAvailable = true;
      }

      if (row < 3 && gameBoard[row][col] === 0) {
        movesAvailable = true;
      }
    }
  }

  if (!movesAvailable) {
    showMessage('message-lose');
  }

  return true;
}

function showMessage(className) {
  const messageElement = document.querySelector(`.message.${className}`);

  messageElement.classList.remove('hidden');
}

function checkWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameBoard[row][col] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function moveLeft() {
  let hasChanged = false;
  const mergedCells = [];

  for (let row = 0; row < 4; row++) {
    let mergeAllowed = true;

    for (let col = 1; col < 4; col++) {
      if (gameBoard[row][col] !== 0) {
        let newCol = col;

        while (newCol > 0 && gameBoard[row][newCol - 1] === 0) {
          newCol--;
        }

        if (newCol > 0 && gameBoard[row][newCol - 1]
           === gameBoard[row][col] && mergeAllowed) {
          gameBoard[row][newCol - 1] *= 2;
          gameBoard[row][col] = 0;
          mergeAllowed = false;
          score += gameBoard[row][newCol - 1];
          hasChanged = true;

          mergedCells
            .push(document.getElementById(`cell-${row}-${newCol - 1}`));
        } else if (newCol !== col) {
          gameBoard[row][newCol] = gameBoard[row][col];
          gameBoard[row][col] = 0;
          hasChanged = true;
        }
      }
    }
  }
  animateMergedCells(mergedCells);
  addRandomTile();
  mergedCells.length = 0;

  return hasChanged;
}

function moveRight() {
  let hasChanged = false;
  const mergedCells = [];

  for (let row = 0; row < 4; row++) {
    let mergeAllowed = true;

    for (let col = 2; col >= 0; col--) {
      if (gameBoard[row][col] !== 0) {
        let newCol = col;

        while (newCol < 3 && gameBoard[row][newCol + 1] === 0) {
          newCol++;
        }

        if (newCol < 3 && gameBoard[row][newCol + 1]
           === gameBoard[row][col] && mergeAllowed) {
          gameBoard[row][newCol + 1] *= 2;
          gameBoard[row][col] = 0;
          mergeAllowed = false;
          score += gameBoard[row][newCol + 1];
          hasChanged = true;

          mergedCells
            .push(document.getElementById(`cell-${row}-${newCol + 1}`));
        } else if (newCol !== col) {
          gameBoard[row][newCol] = gameBoard[row][col];
          gameBoard[row][col] = 0;
          hasChanged = true;
        }
      }
    }
  }
  animateMergedCells(mergedCells);
  addRandomTile();
  mergedCells.length = 0;

  return hasChanged;
}

function moveUp() {
  let hasChanged = false;
  const mergedCells = [];

  for (let col = 0; col < 4; col++) {
    let mergeAllowed = true;

    for (let row = 1; row < 4; row++) {
      if (gameBoard[row][col] !== 0) {
        let newRow = row;

        while (newRow > 0 && gameBoard[newRow - 1][col] === 0) {
          newRow--;
        }

        if (newRow > 0 && gameBoard[newRow - 1][col]
           === gameBoard[row][col] && mergeAllowed) {
          gameBoard[newRow - 1][col] *= 2;
          gameBoard[row][col] = 0;
          mergeAllowed = false;
          score += gameBoard[newRow - 1][col];
          hasChanged = true;

          mergedCells
            .push(document.getElementById(`cell-${newRow - 1}-${col}`));
        } else if (newRow !== row) {
          gameBoard[newRow][col] = gameBoard[row][col];
          gameBoard[row][col] = 0;
          hasChanged = true;
        }
      }
    }
  }
  animateMergedCells(mergedCells);
  addRandomTile();
  mergedCells.length = 0;

  return hasChanged;
}

function moveDown() {
  let hasChanged = false;
  const mergedCells = [];

  for (let col = 0; col < 4; col++) {
    let mergeAllowed = true;

    for (let row = 2; row >= 0; row--) {
      if (gameBoard[row][col] !== 0) {
        let newRow = row;

        while (newRow < 3 && gameBoard[newRow + 1][col] === 0) {
          newRow++;
        }

        if (newRow < 3 && gameBoard[newRow + 1][col]
           === gameBoard[row][col] && mergeAllowed) {
          gameBoard[newRow + 1][col] *= 2;
          gameBoard[row][col] = 0;
          mergeAllowed = false;
          score += gameBoard[newRow + 1][col];
          hasChanged = true;

          mergedCells
            .push(document.getElementById(`cell-${newRow + 1}-${col}`));
        } else if (newRow !== row) {
          gameBoard[newRow][col] = gameBoard[row][col];
          gameBoard[row][col] = 0;
          hasChanged = true;
        }
      }
    }
  }
  animateMergedCells(mergedCells);
  addRandomTile();
  mergedCells.length = 0;

  return hasChanged;
}

function handleKeyDown(keyEvent) {
  if (isGameOver) {
    return;
  }

  let hasChanged = false;

  switch (keyEvent.key) {
    case 'ArrowLeft':
      hasChanged = moveLeft();
      break;
    case 'ArrowRight':
      hasChanged = moveRight();
      break;
    case 'ArrowUp':
      hasChanged = moveUp();
      break;
    case 'ArrowDown':
      hasChanged = moveDown();
      break;
  }

  if (hasChanged) {
    updateBoardView();
    scoreDisplay.textContent = score;

    if (checkGameOver()) {
      isGameOver = true;
      loseMessage.classList.remove('hidden');

      if (checkWin()) {
        isGameOver = true;
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function updateBoardView() {
  const hasChanged = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[row * 4 + col];
      const value = gameBoard[row][col];

      cell.textContent = value;
      cell.className = `field-cell value-${value}`;
    }
  }

  if (hasChanged) {
    addRandomTile();
  }

  if (checkGameOver()) {
    isGameOver = true;
    loseMessage.classList.remove('hidden');
  }
}

let isFirstClick = true;

function startGame() {
  if (isFirstClick) {
    document.getElementById('startButton').textContent
    = 'Restart';
    isFirstClick = false;
  }
  initializeGame();
  addRandomTile();
  addRandomTile();
  scoreDisplay.textContent = score;
  startMessage.classList.add('hidden');
  document.addEventListener('keydown', handleKeyDown);
  updateBoardView();
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', function(keyEvent) {
  if (keyEvent === 'ArrowLeft') {
    moveLeft();
  } else if (keyEvent === 'ArrowRight') {
    moveRight();
  } else if (keyEvent === 'ArrowUp') {
    moveUp();
  } else if (keyEvent === 'ArrowDown') {
    moveDown();
  }
});
