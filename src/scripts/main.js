'use strict';

const scoreBlock = document.querySelector('.game-score');
const btnStart = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const tbody = document.querySelector('tbody');
const message = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const block = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let start = false;

if (window.matchMedia('(min-width: 1000px)').matches) {
  window.addEventListener('keydown', (e) => {
    if (start) {
      switch (e.key) {
        case 'ArrowUp':
          return moveUp();

        case 'ArrowDown':
          return moveDown();

        case 'ArrowLeft':
          return moveLeft();

        case 'ArrowRight':
          return moveRight();

        default:
      }
    }
  });
} else {
  let x1 = null;
  let y1 = null;

  gameField.addEventListener('touchstart', (e) => {
    const firstTouch = e.changedTouches[0];

    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;
  }, false);

  gameField.addEventListener('touchend', (e) => {
    if (!x1 || !y1) {
      return;
    }

    const x2 = e.changedTouches[0].clientX;
    const y2 = e.changedTouches[0].clientY;

    const diffX = x1 - x2;
    const diffY = y1 - y2;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.sign(diffX) === 1) {
        return moveLeft();
      } else {
        return moveRight();
      }
    } else if (Math.abs(diffX) < Math.abs(diffY)) {
      if (Math.sign(diffY) === 1) {
        return moveUp();
      } else {
        return moveDown();
      }
    } else {

    }
  }, false);
}

function updateNewValue() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  for (let l = 0; l < block.length; l++) {
    const row = document.createElement('tr');

    row.classList.add('field-row');

    for (let k = 0; k < block[l].length; k++) {
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (block[l][k] > 1) {
        cell.classList.add(`field-cell--${block[l][k]}`);
        cell.innerText = `${block[l][k]}`;
      }

      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
}

btnStart.addEventListener('click', () => {
  start = !start;
  btnStart.classList.toggle('restart');
  btnStart.classList.toggle('start');
  message.classList.toggle('hidden');
  messageLose.classList.add('hidden');
  btnStart.innerText = start ? 'Restart' : 'Start';

  if (!start) {
    getRestart();
    scoreBlock.textContent = 0;
  }

  getStart();
});

function addNewValue() {
  const randomValue = Math.ceil(Math.random() * 100);
  const randomRow = Math.ceil(Math.random() * 4) - 1;
  const randomCell = Math.ceil(Math.random() * 4) - 1;

  if (block[randomRow][randomCell] === 0) {
    block[randomRow][randomCell] = randomValue >= 90 ? 4 : 2;
  } else {
    addNewValue();
  }

  updateNewValue();
}

function getStart() {
  if (start) {
    addNewValue();
    addNewValue();
  }
}

function getRestart() {
  for (let i = 0; i < block.length; i++) {
    for (let q = 0; q < block[i].length; q++) {
      block[i][q] = 0;
    }
  }

  updateNewValue();
}

function filterRow(row) {
  return row.filter((cell) => cell !== 0);
}

function move(row) {
  let line = filterRow(row);

  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] === line[i + 1]) {
      line[i] *= 2;
      line[i + 1] = 0;
      scoreBlock.textContent = +scoreBlock.textContent + +line[i];
    }
  }

  line = filterRow(line);

  while (line.length < block.length) {
    line.push(0);
  }

  return line;
}

function moveD(row) {
  let line = filterRow(row);

  for (let i = line.length - 1; i >= 1; i--) {
    if (line[i - 1] === line[i]) {
      line[i] *= 2;
      line[i - 1] = 0;
      scoreBlock.textContent = +scoreBlock.textContent + +line[i];
    }
  }

  line = filterRow(line);

  while (line.length < block.length) {
    line.unshift(0);
  }

  return line;
}

function setWin() {
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      if (block[i][j] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}

function moveLeft() {
  const checkedArr = [];

  for (let i = 0; i < block.length; i++) {
    let row = [
      block[i][0],
      block[i][1],
      block[i][2],
      block[i][3],
    ];
    const defaultRow = [...row];
    const matchCkeck = [];

    row = move(row);

    for (let s = 0; s < defaultRow.length; s++) {
      matchCkeck.push(defaultRow[s] === row[s]);
    }

    block[i][0] = row[0];
    block[i][1] = row[1];
    block[i][2] = row[2];
    block[i][3] = row[3];

    checkedArr.push(!matchCkeck.includes(false));
  }

  if (checkedArr.includes(false)) {
    addNewValue();
  }

  setWin();
  setLose();
}

function moveRight() {
  const checkedArr = [];

  for (let i = 0; i < block.length; i++) {
    let row = [
      block[i][0],
      block[i][1],
      block[i][2],
      block[i][3],
    ];

    const defaultRow = [...row];
    const matchCkeck = [];

    row = moveD(row);

    for (let s = 0; s < defaultRow.length; s++) {
      matchCkeck.push(defaultRow[s] === row[s]);
    }

    block[i][0] = row[0];
    block[i][1] = row[1];
    block[i][2] = row[2];
    block[i][3] = row[3];

    checkedArr.push(!matchCkeck.includes(false));
  }

  if (checkedArr.includes(false)) {
    addNewValue();
  }

  setWin();
  setLose();
}

function moveDown() {
  const checkedArr = [];

  for (let i = 0; i < block.length; i++) {
    let row = [
      block[0][i],
      block[1][i],
      block[2][i],
      block[3][i],
    ];

    const defaultRow = [...row];
    const matchCkeck = [];

    row = moveD(row);

    for (let s = 0; s < defaultRow.length; s++) {
      matchCkeck.push(defaultRow[s] === row[s]);
    }

    block[0][i] = row[0];
    block[1][i] = row[1];
    block[2][i] = row[2];
    block[3][i] = row[3];

    checkedArr.push(!matchCkeck.includes(false));
  }

  if (checkedArr.includes(false)) {
    addNewValue();
  }

  setWin();
  setLose();
}

function moveUp() {
  const checkedArr = [];

  for (let i = 0; i < block.length; i++) {
    let row = [
      block[0][i],
      block[1][i],
      block[2][i],
      block[3][i],
    ];
    const defaultRow = [...row];
    const matchCkeck = [];

    row = move(row);

    for (let s = 0; s < defaultRow.length; s++) {
      matchCkeck.push(defaultRow[s] === row[s]);
    }

    block[0][i] = row[0];
    block[1][i] = row[1];
    block[2][i] = row[2];
    block[3][i] = row[3];

    checkedArr.push(!matchCkeck.includes(false));
  }

  if (checkedArr.includes(false)) {
    addNewValue();
  }

  setWin();
  setLose();
}

function setLose() {
  let checkedBlock = false;
  const checkedArr = [];

  for (let k = 0; k < block.length; k++) {
    if (block[k].includes(0)) {
      checkedBlock = false;
      break;
    } else {
      checkedBlock = true;
    }
  }

  if (checkedBlock) {
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < block[i].length; j++) {
        if (block[i][j] > 0) {
          const u = i > 0 && block[i - 1][j] === block[i][j];
          const d = i < block.length - 1 && block[i + 1][j] === block[i][j];
          const r = j < block[i].length - 1 && block[i][j + 1] === block[i][j];
          const l = j > 0 && block[i][j - 1] === block[i][j];

          if (!(u || d || r || l)) {
            checkedArr.push(!(u || d || r || l));
          }
        }
      }
    }
  }

  if (checkedArr.length === 16) {
    messageLose.classList.remove('hidden');
  }
}
