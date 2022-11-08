'use strict';

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const rowsArr = [...document.querySelectorAll('.field-row')];
const cellsArr = [...document.querySelectorAll('.field-cell')];
const gameScore = document.querySelector('.game-score');

const width = 4;
let result = 0;

function gameBeginning() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  launchingRandom();
  launchingRandom();
}

const empty = () => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      if (field[x][y] === 0) {
        return true;
      }
    }
  }

  return false;
};

const squareValue = (square, num) => {
  square.innerText = '';
  square.classList.value = '';
  square.classList.add(`field-cell--${num}`, 'field-cell');

  if (num > 0) {
    square.innerText = num;
  }

  if (square === 2048) {
    messageWin.classList.remove('hidden');
  }
};

const launchingRandom = () => {
  if (!empty()) {
    return;
  }

  let detected = false;

  while (!detected) {
    const x = Math.floor(Math.random() * 4);
    const y = Math.floor(Math.random() * 4);

    if (field[x][y] === 0) {
      const square = rowsArr[x].children[y];

      if (Math.random() > 0.9) {
        field[x][y] = 4;
        squareValue(square, 4);
      } else {
        field[x][y] = 2;
        squareValue(square, 2);
      }

      detected = true;
    }
  }
};

function connect(quadrates) {
  let el = quadrates.filter(item => item !== 0);

  for (let i = 0; i < el.length - 1; i++) {
    if (el[i] === el[i + 1]) {
      el[i] = el[i] * 2;
      el[i + 1] = 0;
      result += el[i];
    }
  }

  gameScore.innerHTML = result;
  el = el.filter(item => item !== 0);

  while (el.length < width) {
    el.push(0);
  }

  return el;
}

function checkConnection() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width - 1; y++) {
      if (field[x][y] === field[x][y + 1] || field[y][x] === field[y + 1][x]) {
        return true;
      }
    }
  }

  return false;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      for (let y = 0; y < width; y++) {
        let el = field.map(item => item[y]);

        el = connect(el);

        for (let x = 0; x < width; x++) {
          field[x][y] = el[x];

          const quadrate = rowsArr[x].children[y];
          const number = field[x][y];

          squareValue(quadrate, number);
        }
      }

      launchingRandom();
      break;
    case 'ArrowDown':
      for (let y = 0; y < width; y++) {
        let el = field.map(item => item[y]).reverse();

        el = connect(el);
        el.reverse();

        for (let x = 0; x < width; x++) {
          field[x][y] = el[x];

          const quadrate = rowsArr[x].children[y];
          const number = field[x][y];

          squareValue(quadrate, number);
        }
      }

      launchingRandom();
      break;
    case 'ArrowRight':
      for (let x = 0; x < width; x++) {
        let el = field[x];

        el.reverse();
        el = connect(el);
        el.reverse();
        field[x] = el;

        for (let y = 0; y < width; y++) {
          const quadrate = rowsArr[x].children[y];
          const number = field[x][y];

          squareValue(quadrate, number);
        }
      }

      launchingRandom();
      break;
    case 'ArrowLeft':
      for (let x = 0; x < width; x++) {
        let el = field[x];

        el = connect(el);
        field[x] = el;

        for (let y = 0; y < width; y++) {
          const quadrate = rowsArr[x].children[y];
          const number = field[x][y];

          squareValue(quadrate, number);
        }
      }

      launchingRandom();
      break;
  }

  if (!checkConnection() && !empty()) {
    messageLose.classList.remove('hidden');
  }
});

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    gameBeginning();
  }

  if (start.classList.contains('restart')) {
    cellsArr.forEach(i => squareValue(i, 0));
    result = 0;
    gameScore.innerHTML = result;
    gameBeginning();
  }
});
