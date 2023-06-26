'use strict';

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startGameText = document.querySelector('.message-start');
const loseGameText = document.querySelector('.message-lose');
const winGameText = document.querySelector('.message-win');
const cells = document.querySelectorAll('.field-cell');

const numOfCells = 4;
let scoreCount = 0;
let gameField;
let gameStarted = false;

button.addEventListener('click', () => {
  if (gameStarted) {
    restartGame();
  } else {
    startGame();
  }
});

function startGame() {
  gameStarted = true;
  button.classList.add('start');
  button.innerText = 'Start';
  startGameText.classList.add('hidden');
  loseGameText.classList.add('hidden');
  winGameText.classList.add('hidden');

  gameField = Array.from({ length: numOfCells }, () =>
    Array(numOfCells).fill(0)
  );
  scoreCount = 0;
  score.innerText = scoreCount;

  updateCells();
}

function restartGame() {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';

  gameField = Array.from({ length: numOfCells }, () =>
    Array(numOfCells).fill(0)
  );
  scoreCount = 0;
  score.innerText = scoreCount;

  addRandomNumber();
  addRandomNumber();
  updateCells();
}

function addRandomNumber() {
  const emptyCells = [];

  for (let i = 0; i < numOfCells; i++) {
    for (let j = 0; j < numOfCells; j++) {
      if (gameField[i][j] === 0) {
        emptyCells.push({
          row: i,
          col: j,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    gameField[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateCells() {
  for (let i = 0; i < numOfCells; i++) {
    for (let j = 0; j < numOfCells; j++) {
      const cell = cells[i * numOfCells + j];
      const num = gameField[i][j];

      cell.textContent = gameStarted ? (num === 0 ? '' : num) : '';
      cell.className = `field-cell cell-${num}`;
    }
  }

  score.innerText = scoreCount;

  if (isGameWon()) {
    winGameText.classList.remove('hidden');
    button.classList.replace('restart', 'start');
    gameStarted = false;
  }

  if (isGameLost()) {
    loseGameText.classList.remove('hidden');
    gameStarted = false;
  }
}

function isGameWon() {
  return gameField.some((row) => row.includes(2048));
}

function isGameLost() {
  if (gameField.flat().includes(0)) {
    return false;
  }

  for (let i = 0; i < numOfCells; i++) {
    for (let j = 0; j < numOfCells - 1; j++) {
      if (
        gameField[i][j] === gameField[i][j + 1] ||
        gameField[j][i] === gameField[j + 1][i]
      ) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keyup', (e) => {
  if (isGameLost() || isGameWon()) {
    return;
  }

  switch (e.code) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    default:
      return;
  }

  addRandomNumber();
  updateCells();
});

function moveUp() {
  let moved = false;

  for (let j = 0; j < numOfCells; j++) {
    for (let i = 1; i < numOfCells; i++) {
      if (gameField[i][j] !== 0) {
        for (let k = i; k > 0; k--) {
          if (
            gameField[k - 1][j] === 0 ||
            gameField[k - 1][j] === gameField[k][j]
          ) {
            gameField[k - 1][j] += gameField[k][j];
            gameField[k][j] = 0;
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    scoreCount += calculateScore();
    moveUp();
  }
}

function moveDown() {
  let moved = false;

  for (let j = 0; j < numOfCells; j++) {
    for (let i = numOfCells - 2; i >= 0; i--) {
      if (gameField[i][j] !== 0) {
        for (let k = i; k < numOfCells - 1; k++) {
          if (
            gameField[k + 1][j] === 0 ||
            gameField[k + 1][j] === gameField[k][j]
          ) {
            gameField[k + 1][j] += gameField[k][j];
            gameField[k][j] = 0;
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    scoreCount += calculateScore();
    moveDown();
  }
}

function moveLeft() {
  let moved = false;

  for (let i = 0; i < numOfCells; i++) {
    for (let j = 1; j < numOfCells; j++) {
      if (gameField[i][j] !== 0) {
        for (let k = j; k > 0; k--) {
          if (
            gameField[i][k - 1] === 0 ||
            gameField[i][k - 1] === gameField[i][k]
          ) {
            gameField[i][k - 1] += gameField[i][k];
            gameField[i][k] = 0;
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    scoreCount += calculateScore();
    moveLeft();
  }
}

function moveRight() {
  let moved = false;

  for (let i = 0; i < numOfCells; i++) {
    for (let j = numOfCells - 2; j >= 0; j--) {
      if (gameField[i][j] !== 0) {
        for (let k = j; k < numOfCells - 1; k++) {
          if (
            gameField[i][k + 1] === 0 ||
            gameField[i][k + 1] === gameField[i][k]
          ) {
            gameField[i][k + 1] += gameField[i][k];
            gameField[i][k] = 0;
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    scoreCount += calculateScore();
    moveRight();
  }
}

function calculateScore() {
  let score = 0;

  for (let i = 0; i < numOfCells; i++) {
    for (let j = 0; j < numOfCells; j++) {
      score += gameField[i][j];
    }
  }

  return score;
}
