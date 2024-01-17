'use strict';

const cells = document.querySelectorAll('.field-cell');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
let hasChanged = false;

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
  for (let row = 0; row < gameBoard.length; row++) {
    for (let col = 0; col < gameBoard[row].length; col++) {
      if (gameBoard[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < gameBoard.length; row++) {
    for (let col = 0; col < gameBoard[row].length; col++) {
      if (row < gameBoard.length - 1 && gameBoard[row][col]
        === gameBoard[row + 1][col]) {
        return false;
      }

      if (col < gameBoard[row].length - 1 && gameBoard[row][col]
          === gameBoard[row][col + 1]) {
        return false;
      }
    }
  }

  if (isGameOver) {
    return true;
  }
  showMessage('message-lose');
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
  hasChanged = false;

  const mergedCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (gameBoard[row][col] !== 0) {
        let newCol = col;

        while (newCol > 0 && gameBoard[row][newCol - 1] === 0) {
          newCol--;
        }

        if (newCol === 0
           || gameBoard[row][newCol - 1] !== gameBoard[row][col]) {
          if (newCol !== col) {
            gameBoard[row][newCol] = gameBoard[row][col];
            gameBoard[row][col] = 0;
            hasChanged = true;
          }
        } else if (gameBoard[row][newCol - 1] === gameBoard[row][col]) {
          if (!mergedCells
            .includes(document.getElementById(`cell-${row}-${newCol - 1}`))) {
            gameBoard[row][newCol - 1] *= 2;
            gameBoard[row][col] = 0;
            score += gameBoard[row][newCol - 1];
            hasChanged = true;

            mergedCells
              .push(document.getElementById(`cell-${row}-${newCol - 1}`));
          }
        }
      }
    }
  }
  animateMergedCells(mergedCells);
  mergedCells.length = 0;

  return hasChanged;
}

function moveRight() {
  hasChanged = false;

  const mergedCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (gameBoard[row][col] !== 0) {
        let newCol = col;

        while (newCol < 3 && gameBoard[row][newCol + 1] === 0) {
          newCol++;
        }

        if (newCol < 3 && gameBoard[row][newCol + 1]
           === gameBoard[row][col]) {
          gameBoard[row][newCol + 1] *= 2;
          gameBoard[row][col] = 0;
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
  mergedCells.length = 0;

  return hasChanged;
}

function moveUp() {
  hasChanged = false;

  const mergedCells = [];

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (gameBoard[row][col] !== 0) {
        let newRow = row;

        while (newRow > 0 && gameBoard[newRow - 1][col] === 0) {
          newRow--;
        }

        if (newRow > 0 && gameBoard[newRow - 1][col]
           === gameBoard[row][col]) {
          gameBoard[newRow - 1][col] *= 2;
          gameBoard[row][col] = 0;
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
  mergedCells.length = 0;

  return hasChanged;
}

function moveDown() {
  hasChanged = false;

  const mergedCells = [];

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (gameBoard[row][col] !== 0) {
        let newRow = row;

        while (newRow < 3 && gameBoard[newRow + 1][col] === 0) {
          newRow++;
        }

        if (newRow < 3 && gameBoard[newRow + 1][col]
           === gameBoard[row][col]) {
          gameBoard[newRow + 1][col] *= 2;
          gameBoard[row][col] = 0;
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
  mergedCells.length = 0;

  return hasChanged;
}

function handleKeyDown(keyEvent) {
  hasChanged = false;

  const {
    key,
  } = keyEvent;

  switch (key) {
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

  if (hasChanged && !isGameOver) {
    addRandomTile();
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
  hasChanged = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[row * 4 + col];
      const value = gameBoard[row][col];

      if (value !== 0) {
        cell.textContent = value;
        cell.className = `field-cell value-${value}`;
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    }
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
    startButton.classList.add('restart');
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
