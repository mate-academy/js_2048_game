'use strict';

document.addEventListener('DOMContentLoaded', function() {
  initializeBoard();
  updateBoardDOM();

  document.addEventListener('keydown', function(e) {
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

let score = 0;

function createTile(row, col, value) {
  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.classList.add(`tile--${value}`);
  tile.textContent = value;

  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);

  cell.appendChild(tile);
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

  // Populate two random cells to start
  populateRandomCell();
  populateRandomCell();
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

        cell.appendChild(tile);
      }
    }
  }
}

function checkForWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 2048) {
        alert('You won!');
        // Here you can also reset the game or take other actions
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

  alert('Game Over!');

  // Here you can also reset the game or take other actions
  return true;
}

function updateScore() {
  document.querySelector('.game-score').textContent = score;
}

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
