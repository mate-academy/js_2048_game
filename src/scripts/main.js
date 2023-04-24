'use strict';

const start = document.querySelector('.start');
const table = document.querySelector('tbody');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreGame = document.querySelector('.game-score');
const tableSize = 4;
let score = 0;
let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

start.addEventListener('click', buttonClick);

function randomNum() {
  const num = Math.random() < 0.1 ? 4 : 2;
  const randomIndex = () => Math.floor(Math.random() * tableSize);
  let found = false;

  while (!found) {
    const i = randomIndex();
    const k = randomIndex();

    if (field[i][k] === 0) {
      field[i][k] = num;
      found = true;
    }
  }

  renderHtml();
};

function buttonClick() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  start.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');

  start.innerText = 'Restart';

  randomNum();
  randomNum();
};

document.addEventListener('keydown', e => {
  if (!start.classList.contains('restart')) {
    return;
  };

  e.preventDefault();

  const fieldCopy = field.map(arr => arr.slice());

  switch (e.code) {
    case 'ArrowLeft':
      moveCellsLeft();
      break;
    case 'ArrowRight':
      moveCellsRigth();
      break;
    case 'ArrowUp':
      moveCellsUp();
      break;
    case 'ArrowDown':
      moveCellsDown();
      break;
    default:
      break;
  }

  if (fieldChange(field, fieldCopy)) {
    randomNum();
  }

  renderHtml();
});

function fieldChange(fieldGame, fieldCopy) {
  for (let i = 0; i < tableSize; i++) {
    for (let k = 0; k < tableSize; k++) {
      if (fieldGame[i][k] !== fieldCopy[i][k]) {
        return true;
      }
    }
  }

  return false;
}

function renderHtml() {
  for (let i = 0; i < tableSize; i++) {
    for (let k = 0; k < tableSize; k++) {
      const currentCell = table.rows[i].cells[k];
      const value = field[i][k];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.className = `field-cell`;

      if (value > 0) {
        currentCell.innerText = value;
        currentCell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        messageWin.classList.remove('hidden');
        start.classList.replace('restart', 'start');
        start.innerText = 'Start';
      }
    }
  }

  scoreGame.innerText = score;

  if (gameOver()) {
    messageLose.classList.remove('hidden');
  }
}

function gameOver() {
  for (let i = 0; i < tableSize; i++) {
    for (let k = 0; k < tableSize; k++) {
      if (field[i][k] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < tableSize; i++) {
    for (let k = 0; k < tableSize - 1; k++) {
      if (field[i][k] === field[i][k + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < tableSize - 1; i++) {
    for (let k = 0; k < tableSize; k++) {
      if (field[i][k] === field[i + 1][k]) {
        return false;
      }
    }
  }

  return true;
}

function moveCell(row) {
  let newRow = row.filter(val => val !== 0);

  for (let k = 0; k < tableSize - 1; k++) {
    if (newRow[k] === newRow[k + 1] && isFinite(newRow[k])) {
      newRow[k] *= 2;
      newRow[k + 1] = 0;
      score += newRow[k];
    };
  }

  newRow = newRow.filter(val => val !== 0);

  while (newRow.length < tableSize) {
    newRow.push(0);
  }

  return newRow;
};

function moveCellsLeft() {
  for (let i = 0; i < tableSize; i++) {
    let row = field[i];

    row = moveCell(row);
    field[i] = row;
  }
};

function moveCellsRigth() {
  for (let i = 0; i < tableSize; i++) {
    let row = field[i];

    row = moveCell(row.reverse());
    field[i] = row.reverse();
  }
};

function moveCellsUp() {
  for (let i = 0; i < tableSize; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]];

    row = moveCell(row);

    for (let k = 0; k < tableSize; k++) {
      field[k][i] = row[k];
    }
  }
}

function moveCellsDown() {
  for (let i = 0; i < tableSize; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]];

    row = moveCell(row.reverse());
    row.reverse();

    for (let k = 0; k < tableSize; k++) {
      field[k][i] = row[k];
    }
  }
}
