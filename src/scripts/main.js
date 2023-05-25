'use strict';

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
const cellsLength = 4;
let gameClickBehavior = false;

const button = document.querySelector('.button');
const fieldRow = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  gameClickBehavior = true;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');

    handleAddNumber();
    handleAddNumber();
    updateFieldCell();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    gameClickBehavior = false;

    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    updateFieldCell();
  }
});

function getRandomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
};

function handleAddNumber() {
  const emptyRows = [];

  gameField.forEach((row, indexRow) => {
    row.forEach((cell, indexCell) => {
      if (cell === 0) {
        emptyRows.push([indexRow, indexCell]);
      }
    });
  });

  if (emptyRows.length === 0) {
    return;
  }

  const [r, c] = emptyRows[Math.floor(Math.random() * emptyRows.length)];

  gameField[r][c] = getRandomNumber();
};

function updateFieldCell() {
  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength; c++) {
      if (gameField[r][c] === 0) {
        fieldRow[r].children[c].innerHTML = '';
        fieldRow[r].children[c].className = 'field-cell';
      } else {
        fieldRow[r].children[c].innerHTML = gameField[r][c];

        fieldRow[r].children[c].className = `
        field-cell field-cell--${gameField[r][c]}
        `;
      }
    }
  }

  loseInTheGame();
  gameScore.innerHTML = score;
}

function blockGame() {
  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength; c++) {
      if (gameField[r][c] === 2048) {
        return false;
      }
    }
  }
}

document.addEventListener('keyup', (e) => {
  if ((blockGame() === false) || gameClickBehavior === false) {
    return;
  }

  switch (e.code) {
    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    default:
      return;
  }

  handleAddNumber();
  updateFieldCell();
});

function filterZero(row) {
  return row.filter(r => r !== 0);
}

function slider(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < cellsLength) {
    newRow.push(0);
  }

  return newRow;
}

function moveRight() {
  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];

    row.reverse();
    row = slider(row);

    gameField[r] = row.reverse();
  }
}

function moveLeft() {
  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];

    row = slider(row);

    gameField[r] = row;
  }
}

function moveUp() {
  for (let c = 0; c < cellsLength; c++) {
    let row = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ];

    row = slider(row);

    for (let r = 0; r < cellsLength; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < cellsLength; c++) {
    let row = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ];

    row.reverse();
    row = slider(row);
    row.reverse();

    for (let r = 0; r < cellsLength; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function loseInTheGame() {
  const freeCell = gameField.some(r => r.some(c => c === 0));

  if (freeCell) {
    return;
  }

  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]
        || gameField[c][r] === gameField[c + 1][r]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}
