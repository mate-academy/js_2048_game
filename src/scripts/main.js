'use strict';

const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const field = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const allMessages = document.querySelectorAll('.message');

const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  for (let r = 0; r < gameField.length; r++) {
    for (let c = 0; c < gameField[r].length; c++) {
      gameField[r][c] = 0;
    }
  }

  [...cells].map(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  [...allMessages].map(message => message.classList.add('hidden'));

  score.textContent = 0;

  addRandomCell();
  addRandomCell();
  renderGame();

  startButton.blur();
});

document.addEventListener('keyup', key => {
  if (startButton.classList.contains('start')) {
    return 0;
  }

  const copyGameField = JSON.parse(JSON.stringify(gameField));

  switch (key.code) {
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
      return 0;
  }

  if (JSON.stringify(copyGameField) === JSON.stringify(gameField)) {
    return;
  }

  addRandomCell();
  renderGame();

  checkWin();
  checkLose();
});

function getRandomValue() {
  let value = 2;
  const randomPercent = Math.floor(Math.random() * 100);

  if (randomPercent >= 90) {
    value = 4;
  }

  return value;
}

function addRandomCell() {
  let row = Math.floor(Math.random() * 4);
  let cell = Math.floor(Math.random() * 4);

  while (gameField[row][cell] !== 0) {
    row = Math.floor(Math.random() * 4);
    cell = Math.floor(Math.random() * 4);
  }

  gameField[row][cell] = getRandomValue();
}

function renderGame() {
  for (let r = 0; r < gameField.length; r++) {
    const row = field.rows[r];

    for (let c = 0; c < gameField[r].length; c++) {
      const gameCell = row.cells[c];

      gameCell.className = 'field-cell';
      gameCell.textContent = '';

      if (gameField[r][c] !== 0) {
        gameCell.classList.add(`field-cell--${gameField[r][c]}`);
        gameCell.textContent = gameField[r][c];
      }
    }
  }
}

function filterZeroes(row) {
  return row.filter(cell => cell !== 0);
};

function moveCells(row) {
  let cellsRow = filterZeroes(row);

  for (let c = 0; c < cellsRow.length - 1; c++) {
    if (cellsRow[c] === cellsRow[c + 1]) {
      cellsRow[c] *= 2;
      cellsRow[c + 1] = 0;
      score.textContent = (+score.textContent) + (+cellsRow[c]);
    }
  }

  cellsRow = filterZeroes(cellsRow);

  while (cellsRow.length < gameField.length) {
    cellsRow.push(0);
  }

  return cellsRow;
}

function moveLeft() {
  for (let i = 0; i < gameField.length; i++) {
    let row = gameField[i];

    row = moveCells(row);
    gameField[i] = row;
  }
};

function moveRight() {
  for (let i = 0; i < gameField.length; i++) {
    let row = gameField[i].reverse();

    row = moveCells(row);
    gameField[i] = row.reverse();
  }
};

function moveUp() {
  for (let i = 0; i < gameField.length; i++) {
    let row = [
      gameField[0][i],
      gameField[1][i],
      gameField[2][i],
      gameField[3][i],
    ];

    row = moveCells(row);
    gameField[0][i] = row[0];
    gameField[1][i] = row[1];
    gameField[2][i] = row[2];
    gameField[3][i] = row[3];
  }
};

function moveDown() {
  for (let i = 0; i < gameField.length; i++) {
    let row = [
      gameField[0][i],
      gameField[1][i],
      gameField[2][i],
      gameField[3][i],
    ];

    row = row.reverse();
    row = moveCells(row);
    row = row.reverse();

    gameField[0][i] = row[0];
    gameField[1][i] = row[1];
    gameField[2][i] = row[2];
    gameField[3][i] = row[3];
  }
};

function checkWin() {
  if ([...cells].some(cell => cell.classList.contains('field-cell--2048'))) {
    winMessage.classList.remove('hidden');
  }
}

function checkLose() {
  let noMovesVertical = true;
  let noMovesHorizontal = true;

  for (let r = 0; r < gameField.length; r++) {
    for (let c = 0; c < gameField.length - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        noMovesHorizontal = false;

        return;
      }
    }
  }

  for (let r = 0; r < gameField.length; r++) {
    const row = [
      gameField[0][r], gameField[1][r], gameField[2][r], gameField[3][r],
    ];

    for (let c = 0; c < row.length - 1; c++) {
      if (row[c] === row[c + 1]) {
        noMovesVertical = false;

        return;
      }
    }
  }

  if (
    gameField.every(row => row.every(cell => cell !== 0))
    && noMovesHorizontal
    && noMovesVertical
  ) {
    loseMessage.classList.remove('hidden');
  }
}
