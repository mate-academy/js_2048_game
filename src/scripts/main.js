'use strict';

const scoreDisplay = document.querySelector('.game-score');
const button = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const messages = document.querySelectorAll('.message');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

const gameSize = 4;
const winScore = 2048;
let score = 0;

const gameGrid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    startGame();
    button.className = 'button restart';
    button.textContent = 'Restart';

    messages.forEach(message => {
      message.classList.add('hidden');
    });
  } else if (button.classList.contains('restart')) {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
    resetGame();
    startGame();
  }
});

document.addEventListener('keydown', e => {
  e.preventDefault();

  switch (e.key) {
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
});

function startGame() {
  renderGameBoard();

  for (let i = 0; i < 2; i++) {
    setRandomCell();
  }
}

function renderGameBoard() {
  scoreDisplay.textContent = score;

  for (let row = 0; row < gameSize; row++) {
    for (let col = 0; col < gameSize; col++) {
      const cellValue = gameGrid[row][col];
      const cell = cells[row * gameSize + col];

      cell.innerHTML = '';

      if (cellValue !== 0) {
        cell.classList.add(`cell-${cellValue}`);
      } else {
        cell.classList.remove(`cell-${winScore}`);
      }

      if (cellValue !== 0) {
        const cellText = document.createElement('span');

        cellText.textContent = cellValue;
        cell.appendChild(cellText);
      }
    }
  }
}

function resetGame() {
  gameGrid.forEach((row, rowIndex) => {
    row.fill(0);
  });

  score = 0;

  renderGameBoard();
  setRandomCell();
  setRandomCell();

  messages.forEach((message) => {
    message.style.display = 'none';
  });
}

function setRandomCell() {
  const [x, y] = [getRandomNumber(), getRandomNumber()];

  if (gameGrid[x][y] === 0) {
    gameGrid[x][y] = Math.random() >= 0.9 ? 4 : 2;
    checkGameStatus();
  } else {
    setRandomCell();
  }
}

function checkGameStatus() {
  let hasEmptyTile = false;
  let hasWinningTile = false;

  gameGrid.forEach((row) => {
    row.forEach((cellValue) => {
      if (cellValue === winScore) {
        hasWinningTile = true;
      }

      if (cellValue === 0) {
        hasEmptyTile = true;
      }

      messages.forEach((message) => {
        message.style.display = 'none';
      });
    });
  });

  if (hasWinningTile) {
    winMessage.style.display = 'block';
  } else if (!hasEmptyTile && !canMove()) {
    loseMessage.style.display = 'block';
  }
}

function canMove() {
  for (let row = 0; row < gameSize; row++) {
    for (let col = 0; col < gameSize; col++) {
      if (
        (row > 0 && gameGrid[row][col] === gameGrid[row - 1][col])
        || (row < gameSize - 1 && gameGrid[row][col] === gameGrid[row + 1][col])
        || (col > 0 && gameGrid[row][col] === gameGrid[row][col - 1])
        || (col < gameSize - 1 && gameGrid[row][col] === gameGrid[row][col + 1])
      ) {
        return true;
      }
    }
  }

  return false;
}

function mergeTiles(row, col, newRow, newCol) {
  gameGrid[newRow][newCol] += gameGrid[row][col];
  score += gameGrid[newRow][newCol];
  gameGrid[row][col] = 0;
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < gameSize; col++) {
    for (let row = 1; row < gameSize; row++) {
      if (gameGrid[row][col] !== 0) {
        let newRow = row;

        while (newRow > 0 && gameGrid[newRow - 1][col] === 0) {
          gameGrid[newRow - 1][col] = gameGrid[newRow][col];
          gameGrid[newRow][col] = 0;
          newRow--;
          moved = true;
        }

        if (newRow > 0 && gameGrid[newRow - 1][col] === gameGrid[newRow][col]) {
          mergeTiles(newRow, col, newRow - 1, col);
          moved = true;
        }
      }
    }
  }

  if (moved) {
    setRandomCell();
    renderGameBoard();
  }
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < gameSize; col++) {
    for (let row = gameSize - 2; row >= 0; row--) {
      if (gameGrid[row][col] !== 0) {
        let newRow = row;

        while (newRow < gameSize - 1 && gameGrid[newRow + 1][col] === 0) {
          gameGrid[newRow + 1][col] = gameGrid[newRow][col];
          gameGrid[newRow][col] = 0;
          newRow++;
          moved = true;
        }

        if (newRow < gameSize - 1
          && gameGrid[newRow + 1][col] === gameGrid[newRow][col]) {
          mergeTiles(newRow, col, newRow + 1, col);
          moved = true;
        }
      }
    }
  }

  if (moved) {
    setRandomCell();
    renderGameBoard();
  }
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < gameSize; row++) {
    for (let col = 1; col < gameSize; col++) {
      if (gameGrid[row][col] !== 0) {
        let newCol = col;

        while (newCol > 0 && gameGrid[row][newCol - 1] === 0) {
          gameGrid[row][newCol - 1] = gameGrid[row][newCol];
          gameGrid[row][newCol] = 0;
          newCol--;
          moved = true;
        }

        if (newCol > 0 && gameGrid[row][newCol - 1] === gameGrid[row][newCol]) {
          mergeTiles(row, newCol, row, newCol - 1);
          moved = true;
        }
      }
    }
  }

  if (moved) {
    setRandomCell();
    renderGameBoard();
  }
}

function moveRight() {
  let moved = false;

  for (let row = 0; row < gameSize; row++) {
    for (let col = gameSize - 2; col >= 0; col--) {
      if (gameGrid[row][col] !== 0) {
        let newCol = col;

        while (newCol < gameSize - 1 && gameGrid[row][newCol + 1] === 0) {
          gameGrid[row][newCol + 1] = gameGrid[row][newCol];
          gameGrid[row][newCol] = 0;
          newCol++;
          moved = true;
        }

        if (newCol < gameSize - 1
          && gameGrid[row][newCol + 1] === gameGrid[row][newCol]) {
          mergeTiles(row, newCol, row, newCol + 1);
          moved = true;
        }
      }
    }
  }

  if (moved) {
    setRandomCell();
    renderGameBoard();
  }
}

startGame();
