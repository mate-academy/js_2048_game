/* eslint-disable no-shadow */
'use strict';

const gameState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameEnd = false;
let gameStart = false;

const startButton = document.getElementById('start');
const score = document.querySelector('.game-score');

document.addEventListener('keydown', KeyPress);

startButton.addEventListener('click', function() {
  startButton.innerText = 'Restart';
  startButton.className = 'button restart';

  gameStart = true;

  SpawNumbers();
  SpawNumbers();
  updateGameField();
  hideStartMessage();
});

function hideStartMessage() {
  const element = document.getElementById('startMessage');

  element.classList.add('hidden');
}

function SpawNumbers() {
  let empty = false;
  const value = Math.random() < 0.9 ? 2 : 4;

  do {
    const randomRow = Math.floor(Math.random() * gameState.length);
    const randomCol = Math.floor(Math.random() * gameState[0].length);

    if (gameState[randomRow][randomCol] === 0) {
      empty = true;

      gameState[randomRow][randomCol] = value;
    }
  } while (!empty);

  score.innerText = sumState(gameState);
}

function sumState(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      sum += arr[i][j];
    }
  }

  return sum;
}

function KeyPress(event) {
  if (!gameStart || gameEnd) {
    return;
  }

  gameEnd = checkGameOver();

  if (gameEnd) {
    GameOver();
  }

  switch (event.key) {
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
      break;
  }

  if (!isFull()) {
    SpawNumbers();
  }

  updateGameField();
}

function moveUp() {
  for (let move = 0; move < 3; move++) {
    for (let i = 1; i < gameState.length; i++) {
      for (let j = 0; j < gameState[i].length; j++) {
        if (gameState[i][j] !== 0) {
          for (let k = i - 1; k >= 0; k--) {
            if (gameState[k][j] === 0) {
              gameState[k][j] = gameState[k + 1][j];
              gameState[k + 1][j] = 0;
            } else if (gameState[k][j] === gameState[k + 1][j]) {
              gameState[k][j] *= 2;
              gameState[k + 1][j] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  updateGameField();
}

function moveDown() {
  for (let move = 0; move < 3; move++) {
    for (let i = gameState.length - 2; i >= 0; i--) {
      for (let j = 0; j < gameState[i].length; j++) {
        if (gameState[i][j] !== 0) {
          for (let k = i + 1; k < gameState.length; k++) {
            if (gameState[k][j] === 0) {
              gameState[k][j] = gameState[k - 1][j];
              gameState[k - 1][j] = 0;
            } else if (gameState[k][j] === gameState[k - 1][j]) {
              gameState[k][j] *= 2;
              gameState[k - 1][j] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  updateGameField();
}

function moveLeft() {
  for (let move = 0; move < 3; move++) {
    for (let i = 0; i < gameState.length; i++) {
      for (let j = 1; j < gameState[i].length; j++) {
        if (gameState[i][j] !== 0) {
          for (let k = j - 1; k >= 0; k--) {
            if (gameState[i][k] === 0) {
              gameState[i][k] = gameState[i][k + 1];
              gameState[i][k + 1] = 0;
            } else if (gameState[i][k] === gameState[i][k + 1]) {
              gameState[i][k] *= 2;
              gameState[i][k + 1] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  updateGameField();
}

function moveRight() {
  for (let move = 0; move < 3; move++) {
    for (let i = 0; i < gameState.length; i++) {
      for (let j = gameState[i].length - 2; j >= 0; j--) {
        if (gameState[i][j] !== 0) {
          for (let k = j + 1; k < gameState[i].length; k++) {
            if (gameState[i][k] === 0) {
              gameState[i][k] = gameState[i][k - 1];
              gameState[i][k - 1] = 0;
            } else if (gameState[i][k] === gameState[i][k - 1]) {
              gameState[i][k] *= 2;
              gameState[i][k - 1] = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
  updateGameField();
}

function updateGameField() {
  const table = document.querySelector('.game-field');

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      const value = gameState[i][j];
      const fieldRow = table.querySelectorAll('.field-row')[i];
      const cell = fieldRow.querySelectorAll('.field-cell')[j];

      cell.textContent = value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add('field-cell--' + value);
        cell.textContent = value;
      } else if (value === 2048) {
        gameEnd = checkGameOver();
        GameOver();
      } else {
        cell.textContent = '';
      }
    }
  }
}

function checkGameOver() {
  if (!isFull()) {
    return false;
  }

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length - 1; j++) {
      if (gameState[i][j] === gameState[i][j + 1]
        || (i < gameState.length - 1
          && gameState[i][j] === gameState[i + 1][j])) {
        return false;
      }
    }
  }

  return true;
}

function isFull() {
  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      if (gameState[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}

function GameOver() {
  alert('Game Over! No more available moves.');
}
