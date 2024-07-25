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

  // Find all empty cells
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

  // console.log(emptyCells);

  // Select a random empty cell
  if (emptyCells.length > 0) {
    const randomC = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // console.log(randomC);

    gameField[randomC.row][randomC.col] = Math.random() < 0.9 ? 2 : 4;
  }

  // Render Game Field
  for (let i = 0; i < fieldCells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;

    // console.log(col);

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
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (gameField[row][col] !== 0) {
        let currentRow = row;

        while (currentRow > 0 && gameField[currentRow - 1][col] === 0) {
          gameField[currentRow - 1][col] = gameField[currentRow][col];
          gameField[currentRow][col] = 0;
          currentRow--;
        }

        if (
          currentRow > 0
          && gameField[currentRow - 1][col] === gameField[currentRow][col]
        ) {
          gameField[currentRow - 1][col] *= 2;
          score += gameField[currentRow - 1][col];
          gameField[currentRow][col] = 0;
        }

        // fieldCells[(currentRow - 1) * 4 + col].classList.add(
        //   `field-cell--${gameField[currentRow - 1][col]}`,
        // );

        // fieldCells[(currentRow) * 4 + col].classList.remove(
        //   `field-cell--${gameField[currentRow][col]}`,
        // );
      }
    }
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (gameField[row][col] !== 0) {
        let currentRow = row;

        while (currentRow < 3 && gameField[currentRow + 1][col] === 0) {
          gameField[currentRow + 1][col] = gameField[currentRow][col];
          gameField[currentRow][col] = 0;
          currentRow++;
        }

        if (
          currentRow < 3
          && gameField[currentRow + 1][col] === gameField[currentRow][col]
        ) {
          gameField[currentRow + 1][col] *= 2;
          score += gameField[currentRow + 1][col];
          gameField[currentRow][col] = 0;
        }

        // fieldCells[(currentRow + 1) * 4 + col].classList.add(
        //   `field-cell--${gameField[currentRow + 1][col]}`,
        // );

        // fieldCells[(currentRow) * 4 + col].classList.remove(
        //   `field-cell--${gameField[currentRow][col]}`,
        // );
      }
    }
  }
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (gameField[row][col] !== 0) {
        let currentCol = col;

        while (currentCol < 3 && gameField[row][currentCol + 1] === 0) {
          gameField[row][currentCol + 1] = gameField[row][currentCol];
          gameField[row][currentCol] = 0;
          currentCol++;
        }

        if (
          currentCol < 3
          && gameField[row][currentCol + 1] === gameField[row][currentCol]
        ) {
          gameField[row][currentCol + 1] *= 2;
          score += gameField[row][currentCol + 1];
          gameField[row][currentCol] = 0;
        }

        // fieldCells[row + (currentCol + 1) * 4].classList.add(
        //   `field-cell--${gameField[row][currentCol + 1]}`,
        // );

        // fieldCells[row + (currentCol) * 4].classList.remove(
        //   `field-cell--${gameField[row][currentCol]}`,
        // );
      }
    }
  }
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col <= 3; col++) {
      if (gameField[row][col] !== 0) {
        let currentCol = col;

        while (currentCol > 0 && gameField[row][currentCol - 1] === 0) {
          gameField[row][currentCol - 1] = gameField[row][currentCol];
          gameField[row][currentCol] = 0;
          currentCol--;
        }

        if (
          currentCol > 0
          && gameField[row][currentCol - 1] === gameField[row][currentCol]
        ) {
          gameField[row][currentCol - 1] *= 2;
          score += gameField[row][currentCol - 1];
          gameField[row][currentCol] = 0;
        }

        // fieldCells[row + (currentCol - 1) * 4].classList.add(
        //   `field-cell--${gameField[row][currentCol - 1]}`,
        // );

        // fieldCells[row + (currentCol) * 4].classList.remove(
        //   `field-cell--${gameField[row][currentCol]}`,
        // );
      }
    }
  }
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
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      generateNewNumber();
      break;

    case 'ArrowDown':
      moveDown();
      generateNewNumber();
      break;

    case 'ArrowRight':
      moveRight();
      generateNewNumber();
      break;

    case 'ArrowLeft':
      moveLeft();
      generateNewNumber();
      break;
  };

  if (checkGameOver()) {
    messageLose.classList.remove('hidden');
  } else if (checkWin()) {
    messageLose.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
});
