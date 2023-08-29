'use strict';

const button = document.querySelector('.button');
const fieldCells = document.querySelectorAll('.field_cell');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message_lose');
const messageWin = document.querySelector('.message_win');
const messageStart = document.querySelector('.message_start');
let board = [];
let playGame = true;
let score = 0;
let mergedCells = [];

function randomNumbers() {
  return Math.floor(Math.random() * 4);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
};

function youLose() {
  let hasEmptyCell = false;
  let hasSimilarNeibhour = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        hasEmptyCell = true;
      }

      if ((row - 1 >= 0 && board[row - 1][col] === board[row][col])
        || (row + 1 < 4 && board[row + 1][col] === board[row][col])
        || (col - 1 >= 0 && board[row][col - 1] === board[row][col])
        || (col + 1 < 4 && board[row][col + 1] === board[row][col])) {
        hasSimilarNeibhour = true;
      }
    }
  }

  if (hasEmptyCell) {
    generateRandomNumbers();
  } else if (!hasSimilarNeibhour) {
    messageLose.classList.remove('hidden');
  }
};

function generateRandomNumbers() {
  for (let i = 0; i < 1; i++) {
    const row = randomNumbers();
    const col = randomNumbers();

    if (board[row][col] === 0) {
      board[row][col] = getRandomNumber();
    } else {
      i--;
    }
  }
};

function createField() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  mergedCells = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

  generateRandomNumbers();
  generateRandomNumbers();
};

function inRage(row, col) {
  if (row >= 0 && row < 4 && col >= 0 && col < 4) {
    return true;
  }

  return false;
}

function mergeAndMove(row, col, rowChange, colChange) {
  if (board[row][col] !== 0) {
    let kRow = row + rowChange;
    let kCol = col + colChange;

    while (inRage(kRow, kCol) && board[kRow][kCol] === 0) {
      kRow += rowChange;
      kCol += colChange;
    }

    if (inRage(kRow, kCol) && board[kRow][kCol] === board[row][col]
    && !mergedCells[kRow][kCol]) {
      board[kRow][kCol] *= 2;
      mergedCells[kRow][kCol] = true;

      if (board[kRow][kCol] === 2048) {
        messageWin.classList.remove('hidden');
        playGame = false;
      }
      score += board[kRow][kCol];
      board[row][col] = 0;

      const cellMerged = fieldCells[kRow * 4 + kCol];

      cellMerged.classList.add('field_cell--merge');

      cellMerged.addEventListener('animationend', () => {
        cellMerged.classList.remove('field_cell--merge');
        updateBoard();
      });
    } else {
      kRow -= rowChange;
      kCol -= colChange;
      board[kRow][kCol] = board[row][col];

      if (kRow !== row || kCol !== col) {
        board[row][col] = 0;

        const cellMoved = fieldCells[row * 4 + col];

        if (colChange === 1) {
          cellMoved.classList.add('field_cell--moveRight');

          setTimeout(() => {
            cellMoved.classList.remove('field_cell--moveRight');
            updateBoard();
          }, 200);
        }

        if (colChange === -1) {
          cellMoved.classList.add('field_cell--moveLeft');

          setTimeout(() => {
            cellMoved.classList.remove('field_cell--moveLeft');
            updateBoard();
          }, 200);
        }

        if (rowChange === 1) {
          cellMoved.classList.add('field_cell--moveDown');

          setTimeout(() => {
            cellMoved.classList.remove('field_cell--moveDown');
            updateBoard();
          }, 200);
        }

        if (rowChange === -1) {
          cellMoved.classList.add('field_cell--moveUp');

          setTimeout(() => {
            cellMoved.classList.remove('field_cell--moveUp');
            updateBoard();
          }, 200);
        }
      }
    }
  }
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      mergeAndMove(row, col, 0, 1);
    }
  }
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      mergeAndMove(row, col, 0, -1);
    }
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      mergeAndMove(row, col, 1, 0);
    }
  }
}

function moveUp() {
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      mergeAndMove(row, col, -1, 0);
    }
  }
}

function resetMergedCells() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      mergedCells[row][col] = false;
    }
  }
}

document.addEventListener('keydown', events => {
  if (playGame) {
    const pressedKey = events.key;

    switch (pressedKey) {
      case 'ArrowUp': moveUp();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowDown': moveDown();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowLeft': moveLeft();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowRight': moveRight();
        youLose();
        resetMergedCells();
        break;
    };
  }
});

function updateCell(row, col) {
  const cell = fieldCells[row * 4 + col];
  const value = board[row][col];

  gameScore.textContent = score;

  cell.textContent = value || '';

  cell.className = 'field_cell';

  switch (value) {
    case 2:
      cell.classList.add('field_cell--2');
      break;
    case 4:
      cell.classList.add('field_cell--4');
      break;
    case 8:
      cell.classList.add('field_cell--8');
      break;
    case 16:
      cell.classList.add('field_cell--16');
      break;
    case 32:
      cell.classList.add('field_cell--32');
      break;
    case 64:
      cell.classList.add('field_cell--64');
      break;
    case 128:
      cell.classList.add('field_cell--128');
      break;
    case 256:
      cell.classList.add('field_cell--256');
      break;
    case 512:
      cell.classList.add('field_cell--512');
      break;
    case 1024:
      cell.classList.add('field_cell--1024');
      break;
    case 2048:
      cell.classList.add('field_cell--2048');
      break;
  }
}

function updateBoard() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      updateCell(row, col);
    }
  }
};

button.addEventListener('click', () => {
  playGame = true;
  messageStart.classList.add('hidden');

  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    playGame = false;
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    playGame = true;
  }
  score = 0;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  createField();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      updateCell(row, col);
    }
  }
});
