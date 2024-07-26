'use strict';

const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const fieldCells = document.querySelectorAll('.field-cell');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let score = 0;
let gameField = [];

function startGame() {
  score = 0;
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  gameScore.textContent = score;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  generateNewNumber();
  generateNewNumber();
}

function generateNewNumber() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] === 0) {
        emptyCells.push({
          row,
          col,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomC = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameField[randomC.row][randomC.col] = Math.random() < 0.9 ? 2 : 4;
  }

  for (let i = 0; i < fieldCells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;

    fieldCells[i].textContent
      = gameField[row][col] === 0 ? '' : gameField[row][col];

    fieldCells[i].classList.remove(
      `field-cell--${gameField[row][col]}`,
    );

    if (gameField[row][col] !== 0) {
      fieldCells[i].classList.add(
        `field-cell--${gameField[row][col]}`,
      );
    } else {
      fieldCells[i].className = 'field-cell';
    }
  }

  gameScore.textContent = score;
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (gameField[row][col] !== 0) {
        let currentRow = row;

        while (currentRow > 0 && gameField[currentRow - 1][col] === 0) {
          gameField[currentRow - 1][col] = gameField[currentRow][col];
          gameField[currentRow][col] = 0;
          currentRow--;
          moved = true;
        }

        if (
          currentRow > 0
          && gameField[currentRow - 1][col] === gameField[currentRow][col]
        ) {
          gameField[currentRow - 1][col] *= 2;
          score += gameField[currentRow - 1][col];
          gameField[currentRow][col] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (gameField[row][col] !== 0) {
        let currentRow = row;

        while (currentRow < 3 && gameField[currentRow + 1][col] === 0) {
          gameField[currentRow + 1][col] = gameField[currentRow][col];
          gameField[currentRow][col] = 0;
          currentRow++;
          moved = true;
        }

        if (
          currentRow < 3
          && gameField[currentRow + 1][col] === gameField[currentRow][col]
        ) {
          gameField[currentRow + 1][col] *= 2;
          score += gameField[currentRow + 1][col];
          gameField[currentRow][col] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (gameField[row][col] !== 0) {
        let currentCol = col;

        while (currentCol < 3 && gameField[row][currentCol + 1] === 0) {
          gameField[row][currentCol + 1] = gameField[row][currentCol];
          gameField[row][currentCol] = 0;
          currentCol++;
          moved = true;
        }

        if (
          currentCol < 3
          && gameField[row][currentCol + 1] === gameField[row][currentCol]
        ) {
          gameField[row][currentCol + 1] *= 2;
          score += gameField[row][currentCol + 1];
          gameField[row][currentCol] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col <= 3; col++) {
      if (gameField[row][col] !== 0) {
        let currentCol = col;

        while (currentCol > 0 && gameField[row][currentCol - 1] === 0) {
          gameField[row][currentCol - 1] = gameField[row][currentCol];
          gameField[row][currentCol] = 0;
          currentCol--;
          moved = true;
        }

        if (
          currentCol > 0
          && gameField[row][currentCol - 1] === gameField[row][currentCol]
        ) {
          gameField[row][currentCol - 1] *= 2;
          score += gameField[row][currentCol - 1];
          gameField[row][currentCol] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

function checkGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] === 0) {
        return false;
      }

      if (row < 3 && gameField[row][col] === gameField[row + 1][col]) {
        return false;
      }

      if (col < 3 && gameField[row][col] === gameField[row][col + 1]) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] === 2048) {
        return true;
      }
    }
  }

  return false;
}

startButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowUp':
      moved = moveUp();
      break;

    case 'ArrowDown':
      moved = moveDown();
      break;

    case 'ArrowRight':
      moved = moveRight();
      break;

    case 'ArrowLeft':
      moved = moveLeft();
      break;
  };

  if (moved) {
    generateNewNumber();
  }

  if (checkGameOver()) {
    messageLose.classList.remove('hidden');
  } else if (checkWin()) {
    messageLose.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
});
