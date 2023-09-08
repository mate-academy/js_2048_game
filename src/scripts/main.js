'use strict';

const button = document.querySelector('.button');
const fieldCells = document.querySelectorAll('.field_cell');
const gameScore = document.querySelector('.game_score');
const messageLose = document.querySelector('.message_lose');
const messageWin = document.querySelector('.message_win');
const messageStart = document.querySelector('.message_start');
let board = [];
let playGame = true;
let score = 0;
let mergedCells = [];
let prevBoard = [];
const numFour = 4;
const tenPercent = 0.1;
const numTwo = 2;

function randomNumbers() {
  return Math.floor(Math.random() * numFour);
}

function getRandomNumber() {
  return Math.random() > tenPercent ? numTwo : numFour;
};

function youLose() {
  let hasEmptyCell = false;
  let hasSimilarNear = false;

  for (let row = 0; row < numFour; row++) {
    for (let col = 0; col < numFour; col++) {
      if (board[row][col] === 0) {
        hasEmptyCell = true;
      }

      if ((row - 1 >= 0 && board[row - 1][col] === board[row][col])
        || (row + 1 < numFour && board[row + 1][col] === board[row][col])
        || (col - 1 >= 0 && board[row][col - 1] === board[row][col])
        || (col + 1 < numFour && board[row][col + 1] === board[row][col])) {
        hasSimilarNear = true;
      }
    }
  }

  if (hasEmptyCell && JSON.stringify(prevBoard) !== JSON.stringify(board)) {
    generateRandomNumbers();
  } else if (!hasSimilarNear) {
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
};

function inRange(row, col) {
  if (row >= 0 && row < numFour && col >= 0 && col < numFour) {
    return true;
  }

  return false;
}

function mergeAndMove(row, col, rowChange, colChange) {
  if (board[row][col] !== 0) {
    let nextRow = row + rowChange;
    let nextCol = col + colChange;

    while (inRange(nextRow, nextCol) && board[nextRow][nextCol] === 0) {
      nextRow += rowChange;
      nextCol += colChange;
    }

    if (inRange(nextRow, nextCol) && board[nextRow][nextCol] === board[row][col]
      && !mergedCells[nextRow][nextCol]) {
      board[nextRow][nextCol] *= 2;
      mergedCells[nextRow][nextCol] = true;

      if (board[nextRow][nextCol] === 2048) {
        messageWin.classList.remove('hidden');
        playGame = false;
      }
      score += board[nextRow][nextCol];
      board[row][col] = 0;

      const cellMerged = fieldCells[nextRow * numFour + nextCol];

      cellMerged.classList.add('field_cell--merge');

      cellMerged.addEventListener('animationend', () => {
        cellMerged.classList.remove('field_cell--merge');
        updateBoard();
      });
    } else {
      nextRow -= rowChange;
      nextCol -= colChange;
      board[nextRow][nextCol] = board[row][col];

      if (nextRow !== row || nextCol !== col) {
        board[row][col] = 0;

        const cellMoved = fieldCells[row * numFour + col];

        cellMoved.classList.add('field_cell--defaultMove');

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
  for (let row = 0; row < numFour; row++) {
    for (let col = 2; col >= 0; col--) {
      mergeAndMove(row, col, 0, 1);
    }
  }
}

function moveLeft() {
  for (let row = 0; row < numFour; row++) {
    for (let col = 1; col < numFour; col++) {
      mergeAndMove(row, col, 0, -1);
    }
  }
}

function moveDown() {
  for (let col = 0; col < numFour; col++) {
    for (let row = 2; row >= 0; row--) {
      mergeAndMove(row, col, 1, 0);
    }
  }
}

function moveUp() {
  for (let col = 0; col < numFour; col++) {
    for (let row = 1; row < numFour; row++) {
      mergeAndMove(row, col, -1, 0);
    }
  }
}

function resetMergedCells() {
  for (let row = 0; row < numFour; row++) {
    for (let col = 0; col < numFour; col++) {
      mergedCells[row][col] = false;
    }
  }
}

document.addEventListener('keydown', events => {
  if (playGame) {
    const pressedKey = events.key;

    prevBoard = JSON.parse(JSON.stringify(board));

    switch (pressedKey) {
      case 'ArrowRight': moveRight();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowLeft': moveLeft();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowUp': moveUp();
        youLose();
        resetMergedCells();
        break;
      case 'ArrowDown': moveDown();
        youLose();
        resetMergedCells();
        break;
    };
  }
});

function updateCell(row, col) {
  const cell = fieldCells[row * numFour + col];
  const value = board[row][col];

  gameScore.textContent = score;

  cell.textContent = value || '';

  cell.className = 'field_cell';

  if (value !== 0) {
    cell.classList.add(`field_cell--${value}`);
  }
}

function updateBoard() {
  for (let row = 0; row < numFour; row++) {
    for (let col = 0; col < numFour; col++) {
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
    createField();
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    playGame = true;
    score = 0;
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    createField();
    generateRandomNumbers();
    generateRandomNumbers();
  }

  for (let row = 0; row < numFour; row++) {
    for (let col = 0; col < numFour; col++) {
      updateCell(row, col);
    }
  }
});
