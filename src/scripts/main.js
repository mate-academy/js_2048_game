'use strict';

const messageList = document.querySelector('.message-container').children;

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const start = document.querySelector('.start');
const gameField = document.querySelector('tbody');
const showScore = document.querySelector('.game-score');

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score;

start.addEventListener('click', (e) => {
  const element = e.target;

  element.classList.value = 'button restart';
  element.textContent = 'Restart';

  for (let i = 0; i < messageList.length; i++) {
    const message = messageList[i];

    if (!message.classList.contains('hidden')) {
      message.classList.add('hidden');
    }
  }

  messageStart.classList.add('hidden');

  field = field.map(row => row.map(column => 0));

  score = 0;
  showScore.textContent = score;

  startGame();
});

const startGame = () => {
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field.length; c++) {
      const num = field[r][c];

      updateCell(r, c, num);
    }
  }

  setInput();

  setCell();
  setCell();
};

const updateCell = (r, c, num) => {
  const filedCell = gameField.children[r].children[c];

  filedCell.textContent = '';
  filedCell.classList.value = 'field-cell';

  if (num > 0) {
    filedCell.textContent = num;
    filedCell.classList.add('field-cell--' + num);

    if (num === 2048) {
      messageWin.classList.remove('hidden');

      document.removeEventListener('keydown', handleInput, false);
    }

    if (loseGame()) {
      messageLose.classList.remove('hidden');
    }
  }
};

const setInput = () => document.addEventListener('keydown', handleInput);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function hasEmptyCell() {
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field.length; c++) {
      if (field[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function loseGame() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let r = 0; r < field.length - 1; r++) {
    for (let c = 0; c < field.length; c++) {
      if (field[r][c] === field[r + 1][c]) {
        return false;
      }
    }
  }

  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field.length - 1; c++) {
      if (field[r][c] === field[r][c + 1]) {
        return false;
      }
    }
  }

  return true;
}

function setCell() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = getRandomInt(field.length);
    const c = getRandomInt(field.length);

    if (field[r][c] === 0) {
      if (getRandomInt(10) === 0) {
        field[r][c] = 4;
        updateCell(r, c, 4);
      } else {
        field[r][c] = 2;
        updateCell(r, c, 2);
      }

      found = true;
    }
  }
};

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      moveY(e.key);
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      moveX(e.key);
      break;
    default:
      return;
  }

  setCell();
  showScore.textContent = score;
};

const deleteZero = row => row.filter(num => num !== 0);

function move(row) {
  let line = deleteZero(row);

  for (let i = 0; i < line.length; i++) {
    if (line[i] === line[i + 1]) {
      line[i] *= 2;
      line[i + 1] = 0;
      score += row[i];
    }
  }

  line = deleteZero(line);

  while (line.length !== field.length) {
    line.push(0);
  }

  return line;
}

function moveX(side) {
  for (let r = 0; r < field.length; r++) {
    let row = field[r];

    if (side === 'ArrowRight') {
      row.reverse();
      row = move(row);
      row.reverse();
    } else {
      row = move(row);
    }

    field[r] = row;

    for (let c = 0; c < field[r].length; c++) {
      const num = field[r][c];

      updateCell(r, c, num);
    }
  }
}

function moveY(side) {
  for (let c = 0; c < field.length; c++) {
    let row = field.map(num => num[c]);

    if (side === 'ArrowDown') {
      row.reverse();
      row = move(row);
      row.reverse();
    } else {
      row = move(row);
    }

    for (let r = 0; r < field[c].length; r++) {
      field[r][c] = row[r];

      const num = field[r][c];

      updateCell(r, c, num);
    }
  }
}
