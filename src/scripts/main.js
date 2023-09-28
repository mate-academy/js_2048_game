'use strict';

const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const scoreText = document.querySelector('.game-score');
const table = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const rows = 4;
const columns = 4;
let board;
let score = 0;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreText.textContent = score;

  generateTile(true);
  generateTile(true);
});

document.addEventListener('keydown', e => {
  const pressedKey = e.key;
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (arrowKeys.includes(pressedKey)) {
    move(pressedKey);
    scoreText.textContent = score;

    if (isWin()) {
      winMessage.classList.remove('hidden');
    }

    if (isLoss()) {
      loseMessage.classList.remove('hidden');
    }
  }
});

function slideRow(row, isReversed = false) {
  const updatedRow = row.filter(num => num > 0);

  if (isReversed) {
    updatedRow.reverse();
  }

  for (let i = 0; i < updatedRow.length - 1; i++) {
    if (updatedRow[i] === updatedRow[i + 1]) {
      updatedRow.splice(i, 2, updatedRow[i] * 2);
      score += updatedRow[i];
    }
  }

  while (updatedRow.length < row.length) {
    updatedRow.push(0);
  }

  if (isReversed) {
    return updatedRow.reverse();
  }

  return updatedRow;
}

function updateColumn(isDown) {
  for (let c = 0; c < columns; c++) {
    const column = slideRow(board.map(r => r[c]), isDown);

    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];
    }
  }
}

function updateRow(isRight) {
  for (let r = 0; r < rows; r++) {
    board[r] = slideRow(board[r], isRight);
  }
}

function updateField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentCell = table.rows[r].cells[c];

      currentCell.className = '';
      currentCell.classList.add('field-cell', `field-cell--${board[r][c]}`);
      currentCell.textContent = board[r][c] || '';
    }
  }
}

function generateTile(isFirst = false) {
  if (!board.flat().includes(0)) {
    return 'No empty cells left!';
  }

  const tileValue = Math.random() >= 0.9 && !isFirst ? 4 : 2;
  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = tileValue;
      updateField();
      found = true;
    }
  }
}

function move(pressedKey) {
  const prevBoard = [...board];
  let isReversed = false;

  if (pressedKey === 'ArrowDown' || pressedKey === 'ArrowRight') {
    isReversed = true;
  }

  switch (pressedKey) {
    case 'ArrowUp':
    case 'ArrowDown':
      updateColumn(isReversed);
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      updateRow(isReversed);
      break;
    default:
      return 'Unknown command!';
  }

  if (prevBoard.flat() !== board.flat()) {
    generateTile(board);
  }

  updateField();
}

function isWin() {
  return board.flat().includes(2048);
}

function isLoss() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentCell = board[r][c];
      const isZero = currentCell === 0;
      const checkUp = r > 0 && board[r - 1][c] === currentCell;
      const checkDown = r < rows - 1 && board[r + 1][c] === currentCell;
      const checkLeft = c > 0 && board[r][c - 1] === currentCell;
      const checkRight = c < columns - 1 && board[r][c + 1] === currentCell;

      if (isZero || checkDown || checkUp || checkLeft || checkRight) {
        return false;
      }
    }
  }

  return true;
}
