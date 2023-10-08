'use strict';

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const currentScore = document.querySelector('.game-score');
const highScore = document.querySelector('.best-score');
const gameField = document.querySelectorAll('td');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];

let field;
const side = 4;
let score = 0;
let bestScore = 0;
let started = false;

const ARROW = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

const getValue = () => Math.random() > 0.1 ? 2 : 4;
const getIndex = () => Math.floor(Math.random() * side);

const updateScore = () => {
  currentScore.textContent = score;
};

const getBestScore = () => {
  if (score > bestScore) {
    bestScore = score;
  }

  highScore.textContent = bestScore;
};

const getTileId = (r, c) => {
  return r.toString() + '-' + c.toString();
};

const changeStart = () => {
  startButton.innerText = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
};

const canMove = () => {
  setRandomNumber();

  if (isGameOver()) {
    setTimeout(() => {
      messageLose.classList.remove('hidden');
      tbody.style.opacity = '20%';
      getBestScore();
    }, 1000);
  }
};

function setGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let index = 0;

  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      index++;

      const tile = gameField[index - 1];

      tile.id = getTileId(r, c);

      const num = field[r][c];

      updateTile(tile, num);
    }
  }
}

startButton.addEventListener('click', () => {
  started = true;

  setGame();
  getBestScore();

  startMessage.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  tbody.style.opacity = '1';

  score = 0;
  updateScore();

  setRandomNumber();
  setRandomNumber();
});

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    tile.classList.add(num <= 2048 ? `field-cell--${num}` : 'field-cel--2048');
  }
}

function isWin(num) {
  if (num >= 2048) {
    messageWin.classList.remove('hidden');
  }
}

function hasEmptyTile() {
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      if (field[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setRandomNumber() {
  if (!hasEmptyTile()) {
    return;
  }

  let created = false;

  while (!created) {
    const r = getIndex();
    const c = getIndex();

    if (field[r][c] === 0) {
      const tileValue = getValue();

      field[r][c] = tileValue;

      const tile = document.getElementById(getTileId(r, c));

      tile.innerText = `${tileValue}`;
      tile.classList.add(`field-cell--${tileValue}`);
      tile.classList.add('scale');
      created = true;
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (
    started && (e.code === ARROW.LEFT
    || e.code === ARROW.RIGHT
    || e.code === ARROW.UP
    || e.code === ARROW.DOWN)
  ) {
    changeStart();
  }

  switch (e.code) {
    case ARROW.LEFT:
      slideLeft();
      break;

    case ARROW.RIGHT:
      slideRight();
      break;

    case ARROW.UP:
      slideUp();
      break;

    case ARROW.DOWN:
      slideDown();
      break;
  }
});

function isGameOver() {
  const isOver = [];

  for (let r = 0; r < rows.length; r += 1) {
    const fieldRows = [...rows[r].cells];

    const fieldColumns = [
      rows[0].cells[r],
      rows[1].cells[r],
      rows[2].cells[r],
      rows[3].cells[r],
    ];

    for (let i = 0; i < fieldRows.length - 1; i += 1) {
      fieldRows[i].innerText !== fieldRows[i + 1].innerText
        ? isOver.push(true)
        : isOver.push(false);
    }

    for (let j = 0; j < fieldColumns.length - 1; j += 1) {
      fieldColumns[j].innerText !== fieldColumns[j + 1].innerText
        ? isOver.push(true)
        : isOver.push(false);
    }
  }

  for (const tile of gameField) {
    if (!tile.innerText) {
      isOver.push(false);
    }
  }

  return isOver.every(el => el === true);
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let currentRow = row;

  currentRow = filterZero(row);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
      updateScore();
      isWin(currentRow[i]);
    }
  }

  currentRow = filterZero(currentRow);

  while (currentRow.length < side) {
    currentRow.push(0);
  }

  return currentRow;
}

function updateField(r, c) {
  const tile = document.getElementById(getTileId(r, c));
  const num = field[r][c];

  updateTile(tile, num);
}

function slideLeft() {
  const beforeL = String(field);

  for (let r = 0; r < side; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;

    for (let c = 0; c < side; c++) {
      updateField(r, c);
    }
  }

  const afterL = String(field);

  if (beforeL !== afterL) {
    canMove();
  }
}

function slideRight() {
  const beforeR = String(field);

  for (let r = 0; r < side; r++) {
    let row = field[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[r] = row;

    for (let c = 0; c < side; c++) {
      updateField(r, c);
    }
  }

  const afterR = String(field);

  if (beforeR !== afterR) {
    canMove();
  }
}

function slideUp() {
  const beforeU = String(field);

  for (let c = 0; c < side; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row = slide(row);

    for (let r = 0; r < side; r++) {
      field[r][c] = row[r];
      updateField(r, c);
    }
  }

  const afterU = String(field);

  if (beforeU !== afterU) {
    canMove();
  }
}

function slideDown() {
  const beforeD = String(field);

  for (let c = 0; c < side; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < side; r++) {
      field[r][c] = row[r];
      updateField(r, c);
    }
  }

  const afterD = String(field);

  if (beforeD !== afterD) {
    canMove();
  }
}
