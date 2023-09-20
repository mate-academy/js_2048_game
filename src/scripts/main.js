/* eslint-disable no-console */
'use strict';

let gameOver = false;

document.addEventListener('DOMContentLoaded', function() {
  initializeBoard();

  // createTile(0, 0, 2);
  // createTile(0, 1, 4);
  // createTile(1, 0, 8);
  // createTile(1, 1, 16);

  let gameStarted = false;
  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', function() {
    resetBoard();
    resetScore();

    populateRandomCell();
    populateRandomCell();

    updateBoardDOM();
    updateScore();

    hideMessages();
    gameStarted = true;

    startButton.textContent = 'Restart';
  });

  document.addEventListener('keydown', function(e) {
    if (!gameStarted || gameOver) {
      return;
    }

    let moved = false;

    if (e.key === 'ArrowUp') {
      moved = moveUp();
      updateScore();
    } else if (e.key === 'ArrowDown') {
      moved = moveDown();
      updateScore();
    } else if (e.key === 'ArrowLeft') {
      moved = moveLeft();
      updateScore();
    } else if (e.key === 'ArrowRight') {
      moved = moveRight();
      updateScore();
    }

    if (moved) {
      populateRandomCell(); // Your function to populate a random cell
      updateBoardDOM(); // Update the DOM
      checkForWin(); // Check for 2048 tile
      checkForGameOver(); // Check if no more moves
    }
  });
});

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const newTiles = Array(4).fill().map(() => Array(4).fill(false));

console.log(newTiles);

let score = 0;

function createTile(row, col, value) {
  newTiles[row][col] = true;

  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.classList.add(`tile--${value}`);

  if (newTiles[row][col]) {
    tile.classList.add('tile--new');
  }

  tile.textContent = value;

  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);

  cell.appendChild(tile);

  setTimeout(() => {
    tile.classList.remove('tile--new');
    newTiles[row][col] = false; // Reset the new tile flag
  }, 300);
}

function populateRandomCell() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const [randRow, randCol]
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    board[randRow][randCol] = value;
    createTile(randRow, randCol, value);
  }
}

function initializeBoard() {
  const gameField = document.querySelector('.game-field');

  for (let i = 0; i < 4; i++) {
    const row = document.createElement('div');

    row.classList.add('row');

    for (let j = 0; j < 4; j++) {
      const cell = document.createElement('div');

      cell.classList.add('field-cell');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      row.appendChild(cell);
    }
    gameField.appendChild(row);
  }
}

function clearBoardDOM() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach(cell => {
    cell.innerHTML = ''; // Remove all child elements (i.e., tiles)
    cell.className = 'field-cell'; // Reset class to default
  });
}

function updateBoardDOM() {
  clearBoardDOM();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== 0) {
        const cell = document.querySelector(
          `[data-row='${i}'][data-col='${j}']`
        );
        const tile = document.createElement('div');

        tile.classList.add('tile');
        tile.classList.add(`tile--${board[i][j]}`);
        tile.textContent = board[i][j];

        if (newTiles[i][j]) {
          tile.classList.add('tile--new');
        }

        cell.appendChild(tile);

        if (newTiles[i][j]) {
          setTimeout(() => {
            tile.classList.remove('tile--new');
            newTiles[i][j] = false; // Reset the new tile flag
          }, 300);
        }
      }
    }
  }
}

function resetBoard() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      board[row][col] = 0;
    }
  }

  clearBoardDOM();
}

function checkForWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 2048) {
        const messageWin = document.querySelector('.message-win');

        messageWin.classList.remove('hidden');
        gameOver = true;
      }
    }
  }
}

function checkForGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return false;
      } // Empty cell found

      if (row < 3 && board[row][col] === board[row + 1][col]) {
        return false;
      } // Vertical match

      if (col < 3 && board[row][col] === board[row][col + 1]) {
        return false;
      } // Horizontal match
    }
  }

  const messageLose = document.querySelector('.message-lose');

  messageLose.classList.remove('hidden');

  // Here you can also reset the game or take other actions
  return true;
}

function updateScore() {
  document.querySelector('.game-score').textContent = score;
}

function resetScore() {
  score = 0;
  document.querySelector('.game-score').textContent = score;
}

function hideMessages() {
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
}

// figure better how to explain move logic

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    let emptyCol = 3;

    for (let col = 3; col >= 0; col--) {
      if (board[row][col] === 0) {
        continue;
      };

      if (emptyCol !== col) {
        board[row][emptyCol] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      // Merge tiles if they are the same and next to each other
      if (
        emptyCol !== 3
        && board[row][emptyCol] === board[row][emptyCol + 1]
      ) {
        board[row][emptyCol + 1] *= 2;
        board[row][emptyCol] = 0;
        score += board[row][emptyCol + 1];
        moved = true;
      } else {
        emptyCol--;
      }
    }
  }

  return moved;
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    let emptyCol = 0;

    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        continue;
      };

      if (emptyCol !== col) {
        board[row][emptyCol] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyCol !== 0
        && board[row][emptyCol] === board[row][emptyCol - 1]
      ) {
        board[row][emptyCol - 1] *= 2;
        board[row][emptyCol] = 0;
        score += board[row][emptyCol - 1];
        moved = true;
      } else {
        emptyCol++;
      }
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    let emptyRow = 0;

    for (let row = 0; row < 4; row++) {
      if (board[row][col] === 0) {
        continue;
      }

      if (emptyRow !== row) {
        board[emptyRow][col] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyRow !== 0
        && board[emptyRow][col] === board[emptyRow - 1][col]
      ) {
        board[emptyRow - 1][col] *= 2;
        board[emptyRow][col] = 0;
        score += board[emptyRow - 1][col];
        moved = true;
      } else {
        emptyRow++;
      }
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    let emptyRow = 3;

    for (let row = 3; row >= 0; row--) {
      if (board[row][col] === 0) {
        continue;
      };

      if (emptyRow !== row) {
        board[emptyRow][col] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyRow !== 3
        && board[emptyRow][col] === board[emptyRow + 1][col]
      ) {
        board[emptyRow + 1][col] *= 2;
        board[emptyRow][col] = 0;
        score += board[emptyRow + 1][col];
        moved = true;
      } else {
        emptyRow--;
      }
    }
  }

  return moved;
}
