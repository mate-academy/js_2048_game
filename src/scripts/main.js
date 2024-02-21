'use strict';

let score = 0;
let gameWon = false;
let gameOver = false;
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function initializeBoard() {
  addRandomTile();
  score = 0;
  gameWon = false;
  gameOver = false;
  updateBoard();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.button.start').textContent = 'Restart';
  document.querySelector('.button.start').classList.add('restart');
}

function addRandomTile() {
  const emptyCells = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ row: r, column: c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomCell.row][randomCell.column] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const x = Math.floor(index / 4);
    const y = index % 4;

    cell.textContent = board[x][y] === 0 ? '' : board[x][y];
    cell.className = 'field-cell';

    if (board[x][y] !== 0) {
      cell.classList.add('field-cell--' + board[x][y]);
    }
  });

  document.querySelector('.game-score').textContent = score;

  if (checkWin()) {
    gameWon = true;
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (checkGameOver()) {
    gameOver = true;
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

function move(direction) {
  if (gameWon || gameOver) {
    return;
  }

  let moved = false;

  if (direction === 'up') {
    moved = moveUp();
  } else if (direction === 'down') {
    moved = moveDown();
  } else if (direction === 'left') {
    moved = moveLeft();
  } else if (direction === 'right') {
    moved = moveRight();
  }

  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveLeft() {
  let moved = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 1; c < 4; c++) {
      if (board[r][c] !== 0) {
        let k = c - 1;

        while (k >= 0 && (board[r][k] === 0 || board[r][k] === board[r][c])) {
          if (board[r][k] === 0) {
            board[r][k] = board[r][c];
            board[r][c] = 0;
            c = k + 1;
            moved = true;
          } else if (board[r][k] === board[r][c]) {
            board[r][k] *= 2;
            score += board[r][k];
            board[r][c] = 0;
            moved = true;
            break;
          }
          k--;
        }
      }
    }
  }

  return moved;
}

function moveRight() {
  let moved = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 2; c >= 0; c--) {
      if (board[r][c] !== 0) {
        let k = c + 1;

        while (k < 4 && (board[r][k] === 0 || board[r][k] === board[r][c])) {
          if (board[r][k] === 0) {
            board[r][k] = board[r][c];
            board[r][c] = 0;
            c = k - 1;
            moved = true;
          } else if (board[r][k] === board[r][c]) {
            board[r][k] *= 2;
            score += board[r][k];
            board[r][c] = 0;
            moved = true;
            break;
          }
          k++;
        }
      }
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let c = 0; c < 4; c++) {
    for (let r = 1; r < 4; r++) {
      if (board[r][c] !== 0) {
        let k = r - 1;

        while (k >= 0 && (board[k][c] === 0 || board[k][c] === board[r][c])) {
          if (board[k][c] === 0) {
            board[k][c] = board[r][c];
            board[r][c] = 0;
            r = k + 1;
            moved = true;
          } else if (board[k][c] === board[r][c]) {
            board[k][c] *= 2;
            score += board[k][c];
            board[r][c] = 0;
            moved = true;
            break;
          }
          k--;
        }
      }
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let c = 0; c < 4; c++) {
    for (let r = 2; r >= 0; r--) {
      if (board[r][c] !== 0) {
        let k = r + 1;

        while (k < 4 && (board[k][c] === 0 || board[k][c] === board[r][c])) {
          if (board[k][c] === 0) {
            board[k][c] = board[r][c];
            board[r][c] = 0;
            r = k - 1;
            moved = true;
          } else if (board[k][c] === board[r][c]) {
            board[k][c] *= 2;
            score += board[k][c];
            board[r][c] = 0;
            moved = true;
            break;
          }
          k++;
        }
      }
    }
  }

  return moved;
}

function checkWin() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function checkGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        return false;
      }

      if ((r < 3 && board[r][c] === board[r + 1][c])
      || (c < 3 && board[r][c] === board[r][c + 1])) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keydown', function(typeOfEvent) {
  if (typeOfEvent.key === 'ArrowUp') {
    move('up');
  } else if (typeOfEvent.key === 'ArrowDown') {
    move('down');
  } else if (typeOfEvent.key === 'ArrowLeft') {
    move('left');
  } else if (typeOfEvent.key === 'ArrowRight') {
    move('right');
  }
});

document.querySelector('.button.start').addEventListener('click', function() {
  if (gameOver || gameWon) {
    restart();
  } else {
    initializeBoard();
  }
});

function restart() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0;
    }
  }

  score = 0;
  gameWon = false;
  gameOver = false;

  const startButton = document.querySelector('.button.start');

  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');

  updateBoard();
}
