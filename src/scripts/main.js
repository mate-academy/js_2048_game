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
const numFour = 4;
const tenPercent = 0.1;
const numTwo = 2;

function getRandomNumber() {
  return Math.random() > tenPercent ? numTwo : numFour;
}

function generateRandomNumbers() {
  const availableCells = [];

  for (let i = 0; i < numFour; i++) {
    for (let j = 0; j < numFour; j++) {
      if (board[i][j] === 0) {
        availableCells.push({
          row: i, col: j,
        });
      }
    }
  }

  if (availableCells.length > 0) {
    const randomCell
      = availableCells[Math.floor(Math.random() * availableCells.length)];

    board[randomCell.row][randomCell.col] = getRandomNumber();
  }
}

function createField() {
  board = Array.from({ length: numFour }, () => Array(numFour).fill(0));

  mergedCells = Array.from({ length: numFour },
    () => Array(numFour).fill(false));
}

function inRange(row, col) {
  return row >= 0 && row < numFour && col >= 0 && col < numFour;
}

function mergeAndMove(row, col, rowChange, colChange) {
  if (board[row][col] !== 0) {
    let nextRow = row + rowChange;
    let nextCol = col + colChange;

    while (inRange(nextRow, nextCol) && board[nextRow][nextCol] === 0) {
      nextRow += rowChange;
      nextCol += colChange;
    }

    if (inRange(nextRow, nextCol) && board[nextRow][nextCol]
      === board[row][col] && !mergedCells[nextRow][nextCol]) {
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
  let canMove = false;

  for (let row = 0; row < numFour; row++) {
    for (let col = numFour - 2; col >= 0; col--) {
      if (board[row][col] !== 0) {
        for (let k = col + 1; k < numFour; k++) {
          if (board[row][k] === 0) {
            canMove = true;
            mergeAndMove(row, col, 0, 1);
            break;
          } else if (board[row][k] === board[row][col]) {
            canMove = true;
            mergeAndMove(row, col, 0, 1);
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    setTimeout(() => {
      updateBoard();
      generateRandomNumbers();
      updateBoard();
      youLose();
    }, 200);
  }
}

function moveLeft() {
  let canMove = false;

  for (let row = 0; row < numFour; row++) {
    for (let col = 1; col < numFour; col++) {
      if (board[row][col] !== 0) {
        for (let k = col - 1; k >= 0; k--) {
          if (board[row][k] === 0) {
            canMove = true;
            mergeAndMove(row, col, 0, -1);
            break;
          } else if (board[row][k] === board[row][col]) {
            canMove = true;
            mergeAndMove(row, col, 0, -1);
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    setTimeout(() => {
      updateBoard();
      generateRandomNumbers();
      updateBoard();
      youLose();
    }, 200);
  }
}

function moveDown() {
  let canMove = false;

  for (let col = 0; col < numFour; col++) {
    for (let row = numFour - 2; row >= 0; row--) {
      if (board[row][col] !== 0) {
        for (let k = row + 1; k < numFour; k++) {
          if (board[k][col] === 0) {
            canMove = true;
            mergeAndMove(row, col, 1, 0);
            break;
          } else if (board[k][col] === board[row][col]) {
            canMove = true;
            mergeAndMove(row, col, 1, 0);
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    setTimeout(() => {
      updateBoard();
      generateRandomNumbers();
      updateBoard();
      youLose();
    }, 200);
  }
}

function moveUp() {
  let canMove = false;

  for (let col = 0; col < numFour; col++) {
    for (let row = 1; row < numFour; row++) {
      if (board[row][col] !== 0) {
        for (let k = row - 1; k >= 0; k--) {
          if (board[k][col] === 0) {
            canMove = true;
            mergeAndMove(row, col, -1, 0);
            break;
          } else if (board[k][col] === board[row][col]) {
            canMove = true;
            mergeAndMove(row, col, -1, 0);
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    setTimeout(() => {
      updateBoard();
      generateRandomNumbers();
      updateBoard();
      youLose();
    }, 200);
  }
}

function resetMergedCells() {
  mergedCells = Array.from({ length: numFour },
    () => Array(numFour).fill(false));
}

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
}

button.addEventListener('click', () => {
  playGame = true;
  messageStart.classList.add('hidden');

  if (button.classList.contains('restart')) {
    score = 0;
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    createField();
    generateRandomNumbers();
    generateRandomNumbers();
    updateBoard();
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    playGame = true;
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

document.addEventListener('keydown', events => {
  if (playGame) {
    const pressedKey = events.key;

    switch (pressedKey) {
      case 'ArrowRight':
        moveRight();
        resetMergedCells();
        youLose();
        break;
      case 'ArrowLeft':
        moveLeft();
        resetMergedCells();
        youLose();
        break;
      case 'ArrowUp':
        moveUp();
        resetMergedCells();
        youLose();
        break;
      case 'ArrowDown':
        moveDown();
        resetMergedCells();
        youLose();
        break;
    };
  }
});

function youLose() {
  let canMove = false;

  for (let row = 0; row < numFour; row++) {
    for (let col = 0; col < numFour; col++) {
      if (board[row][col] === 0) {
        canMove = true;
        break;
      }
    }

    if (canMove) {
      break;
    }
  }

  if (!canMove) {
    for (let row = 0; row < numFour; row++) {
      for (let col = 0; col < numFour; col++) {
        const current = board[row][col];

        if (
          (row > 0 && board[row - 1][col] === current)
          || (row < numFour - 1 && board[row + 1][col] === current)
          || (col > 0 && board[row][col - 1] === current)
          || (col < numFour - 1 && board[row][col + 1] === current)
        ) {
          return;
        }
      }
    }
    messageLose.classList.remove('hidden');
  }
}
